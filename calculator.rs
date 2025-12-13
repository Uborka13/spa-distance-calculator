use std::io;

fn main() {
    // Known points
    let d1 = 200.0;
    let mil1 = 533.0;

    let d2 = 600.0;
    let mil2 = 267.0;

    println!("Enter target distance in meters:");

    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let distance: f64 = input.trim().parse().expect("Please enter a number");

    // Linear interpolation formula
    let mil = mil1 + (mil2 - mil1) * ((distance - d1) / (d2 - d1));

    println!("For {:.0} m → {:.2} mil", distance, mil);
}