import pandas as pd

# Create sample AWB numbers
awb_data = {
    'awb': [
        '32570694',  # Your example AWB (without 014- prefix)
        '12345678',  # Sample AWB 1
        '87654321',  # Sample AWB 2
        '11111111',  # Sample AWB 3
        '22222222'   # Sample AWB 4
    ]
}

# Create DataFrame and save to Excel
df = pd.DataFrame(awb_data)
df.to_excel('awb_numbers.xlsx', index=False)
print("Created awb_numbers.xlsx with sample AWB numbers")
print(df)