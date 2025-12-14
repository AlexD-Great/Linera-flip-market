use flip_market::CoinSide;
use linera_sdk::{
    linera_base_types::{Amount, Timestamp},
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use serde::{Deserialize, Serialize};

/// A single bet placed on a flip
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Bet {
    pub player: String,
    pub prediction: CoinSide,
    pub timestamp: Timestamp,
}

/// Status of a flip
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub enum FlipStatus {
    Open,      // Waiting for bets
    Active,    // Has at least one bet
    Completed, // Result determined
}

/// A single coin flip game with multi-bet support
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Flip {
    pub id: u64,
    pub creator: String,
    pub bet_amount: Amount,
    pub bets: Vec<Bet>,           // Multiple bets allowed
    pub result: Option<CoinSide>,
    pub winner: Option<String>,
    pub status: FlipStatus,
    pub created_at: Timestamp,
    pub completed_at: Option<Timestamp>,
}

impl Flip {
    pub fn bet_amount_str(&self) -> String {
        self.bet_amount.to_string()
    }

    pub fn is_active(&self) -> bool {
        self.status == FlipStatus::Active || self.status == FlipStatus::Open
    }

    pub fn total_bets(&self) -> usize {
        self.bets.len()
    }
}

/// Player statistics
#[derive(Debug, Clone, Deserialize, Serialize, Default)]
pub struct PlayerStats {
    pub total_games: u64,
    pub wins: u64,
    pub losses: u64,
    pub total_wagered: Amount,
    pub total_won: Amount,
}

/// The application state using Linera Views
#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct FlipMarketState {
    /// Map of flip_id -> Flip
    pub flips: MapView<u64, Flip>,
    /// Counter for next flip ID
    pub next_flip_id: RegisterView<u64>,
    /// Enhanced player statistics: player address -> PlayerStats
    pub player_stats: MapView<String, PlayerStats>,
    /// Bet history: player address -> list of flip IDs they participated in
    pub player_history: MapView<String, Vec<u64>>,
}
