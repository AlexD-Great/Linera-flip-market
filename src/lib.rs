use linera_sdk::{
    base::{Amount, Owner, WithContractAbi},
    views::{RootView, View},
    Contract, ContractRuntime, Service, ServiceRuntime,
};
use serde::{Deserialize, Serialize};

pub struct FlipMarketAbi;

impl WithContractAbi for FlipMarketAbi {
    type Operation = Operation;
    type Response = ();
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    CreateFlip { bet_amount: Amount },
    PlaceBet { flip_id: u64, prediction: CoinSide },
}

#[derive(Debug, Clone, Copy, Deserialize, Serialize, PartialEq)]
pub enum CoinSide {
    Heads,
    Tails,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Flip {
    pub id: u64,
    pub creator: Owner,
    pub bet_amount: Amount,
    pub player1: Option<(Owner, CoinSide)>,
    pub player2: Option<(Owner, CoinSide)>,
    pub result: Option<CoinSide>,
    pub winner: Option<Owner>,
}

#[derive(RootView)]
pub struct FlipMarketState {
    pub flips: linera_sdk::views::MapView<u64, Flip>,
    pub next_flip_id: linera_sdk::views::RegisterView<u64>,
    pub leaderboard: linera_sdk::views::MapView<Owner, u64>,
}
