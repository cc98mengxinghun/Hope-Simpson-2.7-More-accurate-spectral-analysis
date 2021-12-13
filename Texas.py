import pandas as pd
import os
import matplotlib.pyplot as plt
import datetime
import numpy as np
from scipy import fft

dirPath ="./COVID-19/csse_covid_19_data/csse_covid_19_daily_reports_us"

def get_data(state_name, dirPath):
    days = []
    confirms = []
    Deaths = []
    recovered = []
    files = os.listdir(dirPath)
    for file in files:
        if not os.path.isdir(dirPath + '/' + file) and file != "README.md":
            dayData= pd.read_csv(dirPath + '/' + file).set_index("Province_State")
            dayData = dayData.fillna(0)
            days.append(datetime.datetime.strptime(dayData.loc[state_name].Last_Update.split(" ")[0], '%Y-%m-%d'))
            confirms.append(dayData.loc[state_name].Confirmed)
            Deaths.append(dayData.loc[state_name].Deaths)
            recovered.append(dayData.loc[state_name].Recovered)
    res = {}
    res["days"] = days
    res["confirms"] = confirms
    res["Deaths"] = Deaths
    res["recovered"] = recovered
    return res

data = get_data("Texas", dirPath)

confirms = data["confirms"]
days = data["days"]
day_confirm_data = []

# sort array by date
for i in range(len(confirms)):
    day_confirm_data.append((days[i], confirms[i]))

def takeFirst(elem):
    return elem[0]

# get confirms and new cofirms everyDay
day_confirm_data.sort(key=takeFirst)
days = []
confirms = []
new_confirms = []
for i in range(1, len(day_confirm_data)):
    days.append(day_confirm_data[i][0])
    confirms.append(day_confirm_data[i][1])
    new_confirms.append(day_confirm_data[i][1]- day_confirm_data[i-1][1])

# plot original picture
# plt.plot_date(days, new_confirms, "r")
# plt.show()


#fft
fft_new_confirms = fft.fft(new_confirms)
fft_new_confirms1 = abs(fft_new_confirms)/(len(new_confirms) / 2)
fft_new_confirms2 = fft_new_confirms1[range(len(fft_new_confirms1) // 2)]
freq = fft.fftfreq(len(fft_new_confirms), d = 1)

# threshold for freq
threshold = 0.05

for i in range(len(freq)):
    if freq[i] > threshold or freq[i] < -threshold:
        fft_new_confirms[i] = 0

# ifft get the value
ifft_new_confirms = fft.ifft(fft_new_confirms).real
plt.xlabel('Date')
plt.plot_date(days, new_confirms, "b", label="original")
plt.plot_date(days, ifft_new_confirms, "r", label="afterFFT")
plt.legend()
plt.show()

# plot fft picture
# plt.plot(freq, fft_new_confirms, "b")
# plt.show()


# save data to csv
new_data = {}
str_date = []
for i in range(len(days)):
    str_date.append(days[i].strftime('%Y-%m-%d'))

new_data["date"] = str_date
new_data["total_confirmed"] = confirms
new_data["new_confirmed"] = new_confirms
new_data["new_confirmed_after_fft"] = ifft_new_confirms

new_csv = pd.DataFrame(new_data)
new_csv.to_csv("./mydata/Texas.csv")