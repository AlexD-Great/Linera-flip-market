#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use crate::state::{Bet, Flip, FlipMarketState, FlipStatus, PlayerStats};
use flip_market::CoinSide;
use linera_sdk::{
    abi::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

pub use flip_market::FlipMarketAbi;

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
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = FlipMarketState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        FlipMarketContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        use flip_market::Operation;
        
        match operation {
            Operation::CreateFlip { bet_amount } => {
                let flip_id = *self.state.next_flip_id.get();
                let creator = self
                    .runtime
                    .authenticated_signer()
                    .expect("Missing signer");

                let flip = Flip {
                    id: flip_id,
                    creator: creator.to_string(),
                    bet_amount,
                    bets: Vec::new(),
                    result: None,
                    winner: None,
                    status: FlipStatus::Open,
                    created_at: self.runtime.system_time(),
                    completed_at: None,
                };

                self.state.flips.insert(&flip_id, flip).expect("Failed to insert flip");
                self.state.next_flip_id.set(flip_id + 1);
            }
            Operation::PlaceBet { flip_id, prediction } => {
                let player = self
                    .runtime
                    .authenticated_signer()
                    .expect("Missing signer");

                let mut flip = self
                    .state
                    .flips
                    .get(&flip_id)
                    .await
                    .expect("Failed to get flip")
                    .expect("Flip not found");

                // Check if flip is still open or active
                if flip.status == FlipStatus::Completed {
                    return; // Cannot bet on completed flip
                }

                // Add the bet
                let bet = Bet {
                    player: player.to_string(),
                    prediction,
                    timestamp: self.runtime.system_time(),
                };
                flip.bets.push(bet);

                // Update flip status
                if flip.bets.len() == 1 {
                    flip.status = FlipStatus::Active;
                } else if flip.bets.len() >= 2 {
                    // Complete the flip when second bet is placed
                    flip.status = FlipStatus::Completed;
                    flip.completed_at = Some(self.runtime.system_time());
                    
                    // Generate random result using timestamp
                    let random = self.runtime.system_time().micros() % 2;
                    flip.result = if random == 0 {
                        Some(CoinSide::Heads)
                    } else {
                        Some(CoinSide::Tails)
                    };

                    // Determine winner and update stats for all participants
                    let result = flip.result.unwrap();
                    for bet in &flip.bets {
                        let is_winner = bet.prediction == result;
                        self.update_player_stats(&bet.player, is_winner, flip.bet_amount).await;
                        
                        if is_winner && flip.winner.is_none() {
                            flip.winner = Some(bet.player.clone());
                        }
                    }
                }

                // Update bet history
                self.add_to_player_history(player.to_string(), flip_id).await;
                
                self.state.flips.insert(&flip_id, flip).expect("Failed to update flip");
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {
        panic!("Messages not supported");
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl FlipMarketContract {
    /// Update player statistics after a game
    async fn update_player_stats(&mut self, player: &str, won: bool, bet_amount: linera_sdk::linera_base_types::Amount) {
        
        let mut stats = self.state.player_stats
            .get(player)
            .await
            .expect("Failed to get player stats")
            .unwrap_or_default();
        
        stats.total_games += 1;
        if won {
            stats.wins += 1;
            stats.total_won = stats.total_won.saturating_add(bet_amount.saturating_mul(2));
        } else {
            stats.losses += 1;
        }
        stats.total_wagered = stats.total_wagered.saturating_add(bet_amount);
        
        self.state.player_stats
            .insert(player, stats)
            .expect("Failed to update player stats");
    }

    /// Add flip to player's bet history
    async fn add_to_player_history(&mut self, player: String, flip_id: u64) {
        let mut history = self.state.player_history
            .get(&player)
            .await
            .expect("Failed to get player history")
            .unwrap_or_default();
        
        if !history.contains(&flip_id) {
            history.push(flip_id);
            self.state.player_history
                .insert(&player, history)
                .expect("Failed to update player history");
        }
    }
}
