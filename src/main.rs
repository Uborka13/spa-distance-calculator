use std::io;

fn main_old() {
    // Known points
    let d1 = 200.0;
    let mil1 = 533.0;

    let d2 = 600.0;
    let mil2 = 267.0;

    loop {
        println!("Enter target distance in meters:");

        let mut input = String::new();
        if io::stdin().read_line(&mut input).is_err() {
            println!("Error reading input.");
            continue;
        }

        let distance: f64 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please enter a valid number.");
                continue;
            }
        };

        // Linear interpolation
        let mil = mil1 + (mil2 - mil1) * ((distance - d1) / (d2 - d1));

        // Integer output
        let mil_int = mil.round() as i32;

        println!("→ {} mil\n", mil_int);
    }
}

fn main() {
    // Known points (distance ↔ mil)
    let d1 = 200.0;
    let mil1 = 533.0;

    let d2 = 600.0;
    let mil2 = 267.0;

    // Ask for initial MIL once
    println!("Enter your initial MIL to subtract (e.g. 120):");

    let mut init_input = String::new();
    io::stdin().read_line(&mut init_input).unwrap();

    let initial_mil: i32 = init_input
        .trim()
        .parse()
        .expect("Please enter a valid integer");

    println!("Initial MIL set to subtract: {} mil\n", initial_mil);

    // Continuous loop for distance input
    loop {
        println!("Enter target distance in meters (Ctrl+C to exit):");

        let mut dist_input = String::new();
        if io::stdin().read_line(&mut dist_input).is_err() {
            println!("Error reading input.");
            continue;
        }

        let distance: f64 = match dist_input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please enter a valid number.");
                continue;
            }
        };

        // Linear interpolation
        let mil = mil1 + (mil2 - mil1) * ((distance - d1) / (d2 - d1));
        let mil_int = mil.round() as i32;

        let final_mil = mil_int - initial_mil;

        println!("Calculated MIL: {}", mil_int);
        println!("Final MIL after subtracting {} → {}\n", initial_mil, final_mil);
    }
}

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(distance: i32, initial: i32) -> i32 {
    let d1 = 200.0;
    let mil1 = 533.0;
    let d2 = 600.0;
    let mil2 = 267.0;

    let distance = distance as f64;
    let mil = mil1 + (mil2 - mil1) * ((distance - d1) / (d2 - d1));
    mil.round() as i32 - initial
}
