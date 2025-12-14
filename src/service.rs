#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use crate::state::{Bet, Flip, FlipMarketState, FlipStatus, PlayerStats};
use flip_market::CoinSide;
use linera_sdk::{
    abi::WithServiceAbi,
    views::{View, ViewStorageContext},
    Service, ServiceRuntime,
};
use std::sync::Arc;

pub use flip_market::FlipMarketAbi;

pub struct FlipMarketService {
    state: Arc<FlipMarketState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(FlipMarketService);

impl WithServiceAbi for FlipMarketService {
    type Abi = FlipMarketAbi;
}

impl Service for FlipMarketService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = FlipMarketState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        FlipMarketService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            MutationRoot {
                runtime: self.runtime.clone(),
            },
            EmptySubscription,
        )
        .finish();

        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<FlipMarketState>,
}

#[Object]
impl QueryRoot {
    async fn flips(&self) -> Vec<FlipInfo> {
        let mut result = Vec::new();
        let indices: Vec<u64> = self.state
            .flips
            .indices()
            .await
            .expect("Failed to get flip indices")
            .into_iter()
            .collect();
        
        for id in indices {
            if let Some(flip) = self.state.flips.get(&id).await.expect("Failed to get flip") {
                result.push(FlipInfo {
                    id,
                    creator: flip.creator.clone(),
                    bet_amount: flip.bet_amount.to_string(),
                    status: match flip.status {
                        FlipStatus::Open => "Open".to_string(),
                        FlipStatus::Active => "Active".to_string(),
                        FlipStatus::Completed => "Completed".to_string(),
                    },
                    result: flip.result.map(|r| format!("{:?}", r)),
                    winner: flip.winner.clone(),
                    total_bets: flip.bets.len() as u64,
                    bets: flip.bets.iter().map(|b| BetInfo {
                        player: b.player.clone(),
                        prediction: format!("{:?}", b.prediction),
                        timestamp: b.timestamp.micros(),
                    }).collect(),
                });
            }
        }
        result
    }

    /// Get active (open or in-progress) flips
    async fn active_flips(&self) -> Vec<FlipInfo> {
        let all_flips = self.flips().await;
        all_flips.into_iter()
            .filter(|f| f.status == "Open" || f.status == "Active")
            .collect()
    }

    /// Get player's bet history
    async fn player_history(&self, player: String) -> Vec<FlipInfo> {
        let flip_ids = self.state.player_history
            .get(&player)
            .await
            .expect("Failed to get player history")
            .unwrap_or_default();
        
        let mut result = Vec::new();
        for id in flip_ids {
            if let Some(flip) = self.state.flips.get(&id).await.expect("Failed to get flip") {
                result.push(FlipInfo {
                    id,
                    creator: flip.creator.clone(),
                    bet_amount: flip.bet_amount.to_string(),
                    status: match flip.status {
                        FlipStatus::Open => "Open".to_string(),
                        FlipStatus::Active => "Active".to_string(),
                        FlipStatus::Completed => "Completed".to_string(),
                    },
                    result: flip.result.map(|r| format!("{:?}", r)),
                    winner: flip.winner.clone(),
                    total_bets: flip.bets.len() as u64,
                    bets: flip.bets.iter().map(|b| BetInfo {
                        player: b.player.clone(),
                        prediction: format!("{:?}", b.prediction),
                        timestamp: b.timestamp.micros(),
                    }).collect(),
                });
            }
        }
        result
    }

    /// Get player statistics
    async fn player_stats(&self, player: String) -> Option<PlayerStatsInfo> {
        let stats = self.state.player_stats
            .get(&player)
            .await
            .expect("Failed to get player stats")?;
        
        Some(PlayerStatsInfo {
            player,
            total_games: stats.total_games,
            wins: stats.wins,
            losses: stats.losses,
            win_rate: if stats.total_games > 0 {
                (stats.wins as f64 / stats.total_games as f64) * 100.0
            } else {
                0.0
            },
            total_wagered: stats.total_wagered.to_string(),
            total_won: stats.total_won.to_string(),
        })
    }

    /// Enhanced leaderboard with full statistics
    async fn leaderboard(&self) -> Vec<LeaderboardEntry> {
        let mut entries = Vec::new();
        let keys: Vec<String> = self.state
            .player_stats
            .indices()
            .await
            .expect("Failed to get player stats indices")
            .into_iter()
            .collect();
        
        for player in keys {
            if let Some(stats) = self.state.player_stats.get(&player).await.expect("Failed to get stats") {
                entries.push(LeaderboardEntry {
                    player: player.clone(),
                    wins: stats.wins,
                    losses: stats.losses,
                    total_games: stats.total_games,
                    win_rate: if stats.total_games > 0 {
                        (stats.wins as f64 / stats.total_games as f64) * 100.0
                    } else {
                        0.0
                    },
                    total_won: stats.total_won.to_string(),
                });
            }
        }
        entries.sort_by(|a, b| b.wins.cmp(&a.wins).then(b.win_rate.partial_cmp(&a.win_rate).unwrap()));
        entries
    }
}

struct MutationRoot {
    runtime: Arc<ServiceRuntime<FlipMarketService>>,
}

#[Object]
impl MutationRoot {
    async fn create_flip(&self, bet_amount: String) -> Vec<u8> {
        use flip_market::Operation;
        use linera_sdk::linera_base_types::Amount;
        
        let amount = bet_amount.parse::<Amount>().unwrap_or(Amount::ZERO);
        let operation = Operation::CreateFlip { bet_amount: amount };
        self.runtime.schedule_operation(&operation);
        vec![] // Return operation hash placeholder
    }
    
    async fn place_bet(&self, flip_id: u64, prediction: CoinSide) -> Vec<u8> {
        use flip_market::Operation;
        
        let operation = Operation::PlaceBet { flip_id, prediction };
        self.runtime.schedule_operation(&operation);
        vec![] // Return operation hash placeholder
    }
}

#[derive(Clone)]
struct BetInfo {
    player: String,
    prediction: String,
    timestamp: u64,
}

#[Object]
impl BetInfo {
    async fn player(&self) -> &str { &self.player }
    async fn prediction(&self) -> &str { &self.prediction }
    async fn timestamp(&self) -> u64 { self.timestamp }
}

#[derive(Clone)]
struct FlipInfo {
    id: u64,
    creator: String,
    bet_amount: String,
    status: String,
    result: Option<String>,
    winner: Option<String>,
    total_bets: u64,
    bets: Vec<BetInfo>,
}

#[Object]
impl FlipInfo {
    async fn id(&self) -> u64 { self.id }
    async fn creator(&self) -> &str { &self.creator }
    async fn bet_amount(&self) -> &str { &self.bet_amount }
    async fn status(&self) -> &str { &self.status }
    async fn result(&self) -> Option<&str> { self.result.as_deref() }
    async fn winner(&self) -> Option<&str> { self.winner.as_deref() }
    async fn total_bets(&self) -> u64 { self.total_bets }
    async fn bets(&self) -> &[BetInfo] { &self.bets }
}

#[derive(Clone)]
struct PlayerStatsInfo {
    player: String,
    total_games: u64,
    wins: u64,
    losses: u64,
    win_rate: f64,
    total_wagered: String,
    total_won: String,
}

#[Object]
impl PlayerStatsInfo {
    async fn player(&self) -> &str { &self.player }
    async fn total_games(&self) -> u64 { self.total_games }
    async fn wins(&self) -> u64 { self.wins }
    async fn losses(&self) -> u64 { self.losses }
    async fn win_rate(&self) -> f64 { self.win_rate }
    async fn total_wagered(&self) -> &str { &self.total_wagered }
    async fn total_won(&self) -> &str { &self.total_won }
}

#[derive(Clone)]
struct LeaderboardEntry {
    player: String,
    wins: u64,
    losses: u64,
    total_games: u64,
    win_rate: f64,
    total_won: String,
}

#[Object]
impl LeaderboardEntry {
    async fn player(&self) -> &str { &self.player }
    async fn wins(&self) -> u64 { self.wins }
    async fn losses(&self) -> u64 { self.losses }
    async fn total_games(&self) -> u64 { self.total_games }
    async fn win_rate(&self) -> f64 { self.win_rate }
    async fn total_won(&self) -> &str { &self.total_won }
}
