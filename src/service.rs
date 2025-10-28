#![cfg_attr(target_arch = "wasm32", no_main)]

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use flip_market::{FlipMarketState};
use linera_sdk::{Service, ServiceRuntime};
use std::sync::Arc;

pub struct FlipMarketService {
    state: Arc<FlipMarketState>,
}

linera_sdk::service!(FlipMarketService);

impl Service for FlipMarketService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state: FlipMarketState = bcs::from_bytes(
            &runtime.key_value_store().load_key_value(b"state").await.unwrap_or_default()
        ).unwrap_or_default();
        FlipMarketService {
            state: Arc::new(state),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            MutationRoot,
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
        self.state
            .flips
            .iter()
            .map(|(id, flip)| FlipInfo {
                id: *id,
                creator: flip.creator.clone(),
                bet_amount: flip.bet_amount.to_string(),
                status: if flip.result.is_some() {
                    "Resolved".to_string()
                } else if flip.player2.is_some() {
                    "Full".to_string()
                } else if flip.player1.is_some() {
                    "Waiting".to_string()
                } else {
                    "Open".to_string()
                },
                result: flip.result.map(|r| format!("{:?}", r)),
                winner: flip.winner.clone(),
            })
            .collect()
    }

    async fn leaderboard(&self) -> Vec<LeaderboardEntry> {
        let mut entries: Vec<LeaderboardEntry> = self.state
            .leaderboard
            .iter()
            .map(|(player, wins)| LeaderboardEntry {
                player: player.clone(),
                wins: *wins,
            })
            .collect();
        entries.sort_by(|a, b| b.wins.cmp(&a.wins));
        entries
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn placeholder(&self) -> bool {
        true
    }
}

#[derive(Clone)]
struct FlipInfo {
    id: u64,
    creator: String,
    bet_amount: String,
    status: String,
    result: Option<String>,
    winner: Option<String>,
}

#[Object]
impl FlipInfo {
    async fn id(&self) -> u64 { self.id }
    async fn creator(&self) -> &str { &self.creator }
    async fn bet_amount(&self) -> &str { &self.bet_amount }
    async fn status(&self) -> &str { &self.status }
    async fn result(&self) -> Option<&str> { self.result.as_deref() }
    async fn winner(&self) -> Option<&str> { self.winner.as_deref() }
}

#[derive(Clone)]
struct LeaderboardEntry {
    player: String,
    wins: u64,
}

#[Object]
impl LeaderboardEntry {
    async fn player(&self) -> &str { &self.player }
    async fn wins(&self) -> u64 { self.wins }
}
