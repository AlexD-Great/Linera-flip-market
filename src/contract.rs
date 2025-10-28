#![cfg_attr(target_arch = "wasm32", no_main)]

use flip_market::{CoinSide, Flip, FlipMarketAbi, FlipMarketState, Operation};
use linera_sdk::{
    abi::WithContractAbi,
    linera_base_types::Amount,
    Contract, ContractRuntime,
};

pub struct FlipMarketContract {
    state: FlipMarketState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(FlipMarketContract);

impl WithContractAbi for FlipMarketContract {
    type Abi = FlipMarketAbi;
}

impl Contract for FlipMarketContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = bcs::from_bytes(
            &runtime.key_value_store().load_key_value(b"state").await.unwrap_or_default()
        ).unwrap_or_default();
        FlipMarketContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreateFlip { bet_amount } => {
                let flip_id = self.state.next_flip_id;
                let creator = self
                    .runtime
                    .authenticated_signer()
                    .expect(\"Missing signer\");

                let flip = Flip {
                    id: flip_id,
                    creator: creator.to_string(),
                    bet_amount,
                    player1: None,
                    player2: None,
                    result: None,
                    winner: None,
                };

                self.state.flips.insert(flip_id, flip);
                self.state.next_flip_id = flip_id + 1;
            }
            Operation::PlaceBet { flip_id, prediction } => {
                let player = self
                    .runtime
                    .authenticated_signer()
                    .expect(\"Missing signer\");

                let mut flip = self
                    .state
                    .flips
                    .get(&flip_id)
                    .cloned()
                    .expect("Flip not found");

                if flip.player1.is_none() {
                    flip.player1 = Some((player.to_string(), prediction));
                    self.state.flips.insert(flip_id, flip);
                } else if flip.player2.is_none() && flip.player1.as_ref().unwrap().0 != player.to_string() {
                    flip.player2 = Some((player.to_string(), prediction));
                    
                    let random = self.runtime.system_time().micros() % 2;
                    flip.result = if random == 0 {
                        Some(CoinSide::Heads)
                    } else {
                        Some(CoinSide::Tails)
                    };

                    if flip.player1.as_ref().unwrap().1 == flip.result.unwrap() {
                        flip.winner = Some(flip.player1.as_ref().unwrap().0.clone());
                        self.update_leaderboard(flip.player1.as_ref().unwrap().0.clone()).await;
                    } else {
                        flip.winner = Some(flip.player2.as_ref().unwrap().0.clone());
                        self.update_leaderboard(flip.player2.as_ref().unwrap().0.clone()).await;
                    }

                    self.state.flips.insert(flip_id, flip);
                }
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {
        panic!(\"Messages not supported\");
    }

    async fn store(mut self) {
        let data = bcs::to_bytes(&self.state).expect("Failed to serialize state");
        self.runtime.key_value_store().insert_key_value(b"state".to_vec(), data).await;
    }
}

impl FlipMarketContract {
    async fn update_leaderboard(&mut self, owner: String) {
        let current_score = self.state.leaderboard.get(&owner).cloned().unwrap_or(0);
        self.state.leaderboard.insert(owner, current_score + 1);
    }
}
