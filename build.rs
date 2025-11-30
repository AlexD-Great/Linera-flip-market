fn main() {
    println!("cargo:rustc-env=RUSTFLAGS=-C target-feature=-atomics,-bulk-memory,-mutable-globals,-simd128,-reference-types");
}
