# MIL Calculator Web Tool

A simple, mobile-friendly MIL calculator for shooting, designed to be flexible and field-ready.

---

## Features

- Calculates the MIL for a given distance based on **calibration points**  
- Supports **positive and negative MIL offsets**  
- Auto-updates results as you type — **no button clicks needed**  
- **Calibration editable** for different SPAs (scopes)  
- Mobile-friendly, inputs auto-select for fast editing  
- Displays **calibration range** under the distance input for guidance  
- Ignores distances outside the calibration range to prevent invalid results

---

## How to Use

1. **Initial Setup**
   - Open the website.
   - You’ll see **MIL Offset** and **Distance** inputs.
   - Calibration section can be expanded using the ⚙ button (optional).

2. **Enter MIL Offset**
   - Input any number, positive or negative, depending on whether you want to add or subtract from the calculated MIL.

3. **Enter Distance**
   - Input the target distance in meters.
   - The **Final MIL** will update automatically.
   - If the distance is outside the calibration range, the calculator will not show a result.

4. **Calibration (Optional)**
   - Click ⚙ **Calibration** to expand.
   - You can change:
     - Shortest distance `meter` and `mil` (`d1`, `mil1`)
     - Furthest distance `meter` and `mil` (`d2`, `mil2`)
   - The **calculation will automatically update** based on these values.

5. **Mobile Use**
   - Inputs auto-select when tapped for faster editing.
   - Responsive design works on phones and tablets.

---

## Calibration Example

- Default calibration:
  - `d1 = 200 m`, `mil1 = 533`
  - `d2 = 600 m`, `mil2 = 267`
- Adjust these values for different SPAs.

---

## Notes

- Only distances within the calibration range will produce a result  
- MIL offset can be positive or negative  
- The calculator is designed to be simple and fast for field use
