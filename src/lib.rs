use linera_sdk::{
    abi::{ContractAbi, ServiceAbi},
    linera_base_types::Amount,
};
use serde::{Deserialize, Serialize};

/// The ABI for the Flip Market application
pub struct FlipMarketAbi;

impl ContractAbi for FlipMarketAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for FlipMarketAbi {
    type Query = async_graphql::Request;
    type QueryResponse = async_graphql::Response;
}

/// Operations that can be performed on the contract
#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    CreateFlip { bet_amount: Amount },
    PlaceBet { flip_id: u64, prediction: CoinSide },
}

/// Coin side for betting
#[derive(Debug, Clone, Copy, Deserialize, Serialize, PartialEq, Eq, async_graphql::Enum)]
pub enum CoinSide {
    Heads,
    Tails,
}
