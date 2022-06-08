

test("calculatewinddirection", async () => {

    function calculateWindDirection(degrees: number): string {
        let val = Math.floor((degrees / 45) + 0.5);
        const wind_from_direction_cardinal = ["↑N", "↗NE", "→E", "↘SE", "↓S", "↙SW", "←W", "↖NW"]
        return wind_from_direction_cardinal[(val % 8)]
    }

    for (let i = 0; i < 16; i++) {
        let degrees = i*22.5;
        let result = calculateWindDirection(degrees)
        expect(result).toBe(calculateWindDirection(degrees))
        console.log(`${degrees}: ${result}`)
    }

    
})

// it("calculatewinddirection", async () => {
//     let degrees = 10

//     function calculateWindDirection(degrees: number): string {
//         const wind_from_direction_cardinal = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
//         const wind_from_cardinal_direction = wind_from_direction_cardinal[Math.round(degrees / 45)]
//         return wind_from_cardinal_direction
//     }

//     for (let i = 0; i < 360; i++) {
//         degrees = i
//         let result = calculateWindDirection(degrees)
//         expect(result).toBe(calculateWindDirection(degrees))
//         console.log(`${degrees/45}°: ${result}`)
//     }
// })