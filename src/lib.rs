use linera_sdk::{
    abi::ContractAbi,
    linera_base_types::Amount,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum FlipMarketError {
    #[error("Flip not found: {0}")]
    FlipNotFound(u64),
    #[error("Player already in flip")]
    PlayerAlreadyInFlip,
    #[error("Flip already full")]
    FlipAlreadyFull,
    #[error("Missing signer")]
    MissingSigner,
}

pub struct FlipMarketAbi;

impl ContractAbi for FlipMarketAbi {
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
    pub creator: String,
    pub bet_amount: Amount,
    pub player1: Option<(String, CoinSide)>,
    pub player2: Option<(String, CoinSide)>,
    pub result: Option<CoinSide>,
    pub winner: Option<String>,
}

#[derive(Debug, Default, Deserialize, Serialize)]
pub struct FlipMarketState {
    pub flips: HashMap<u64, Flip>,
    pub next_flip_id: u64,
    pub leaderboard: HashMap<String, u64>,
}
