import pandas as pd

# Create sample AWB numbers
data = {
    'awb': ['1234567890', '9876543210', '5555555555']
}

df = pd.DataFrame(data)
df.to_excel('awb_numbers.xlsx', index=False)
print("Sample Excel file created: awb_numbers.xlsx")