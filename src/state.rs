use flip_market::CoinSide;
use linera_sdk::{
    linera_base_types::Amount,
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use serde::{Deserialize, Serialize};

/// A single coin flip game
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

impl Flip {
    pub fn bet_amount_str(&self) -> String {
        self.bet_amount.to_string()
    }
}

/// The application state using Linera Views
#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct FlipMarketState {
    /// Map of flip_id -> Flip
    pub flips: MapView<u64, Flip>,
    /// Counter for next flip ID
    pub next_flip_id: RegisterView<u64>,
    /// Leaderboard: player address -> win count
    pub leaderboard: MapView<String, u64>,
}
