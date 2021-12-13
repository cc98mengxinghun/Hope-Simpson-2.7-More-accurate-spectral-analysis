import pandas as pd
import os
import matplotlib.pyplot as plt
import datetime
import numpy as np
from scipy import fft

dirPath ="./COVID-19/csse_covid_19_data/csse_covid_19_daily_reports_us"

def get_data(state_name, dirPath):
    confirms = []
    days = []
    deaths = []
    recovered = []
    files = os.listdir(dirPath)
    for file in files:
        if not os.path.isdir(dirPath + '/' + file) and file != "README.md":
            dayData= pd.read_csv(dirPath + '/' + file).set_index("Province_State")
            dayData = dayData.fillna(0)
            days.append(datetime.datetime.strptime(dayData.loc[state_name].Last_Update.split(" ")[0], '%Y-%m-%d'))
            confirms.append(dayData.Confirmed.sum())
            deaths.append(dayData.Deaths.sum())
            recovered.append(dayData.Deaths.sum())

    res = {}
    res["days"] = days
    res["confirms"] = confirms
    res["deaths"] = deaths
    res["recovered"] = recovered
    return res

data = get_data("Texas", dirPath)

confirms = data["confirms"]
deaths = data["deaths"]
recovered = data["recovered"]
days = data["days"]
day_confirm_data = []

# sort array by date
for i in range(len(confirms)):
    day_confirm_data.append((days[i], confirms[i], deaths[i], recovered[i]))

def takeFirst(elem):
    return elem[0]

# get confirms and new cofirms everyDay
day_confirm_data.sort(key=takeFirst)
days = []
confirms = []
deaths = []
recovered = []
new_confirms = []
new_death = []
new_recovered = []
for i in range(1, len(day_confirm_data)):
    days.append(day_confirm_data[i][0])
    confirms.append(day_confirm_data[i][1])
    deaths.append(day_confirm_data[i][2])
    recovered.append(day_confirm_data[i][3])
    new_confirms.append(day_confirm_data[i][1]- day_confirm_data[i-1][1])
    new_death.append(day_confirm_data[i][2]- day_confirm_data[i-1][2])
    new_recovered.append(day_confirm_data[i][3]- day_confirm_data[i-1][3])

# plot original picture
# plt.plot_date(days, new_confirms, "r")
# plt.show()


#fft
def fftFilter(data):
    fft_new_data = fft.fft(data)
    fft_new_data1 = abs(fft_new_data)
    fft_new_data2 = fft_new_data1[range(len(fft_new_data1) // 2)]
    freq = fft.fftfreq(len(fft_new_data))
    fft_pic_data = list(zip(freq, fft_new_data1))
    fft_pic_data.sort(key=takeFirst)

    # threshold for freq
    threshold = 0.05

    # plt the frequency
    plt.plot([a[0] for a in fft_pic_data], [a[1] for a in fft_pic_data], "r")
    plt.show()

    for i in range(len(freq)):
        if freq[i] > threshold or freq[i] < -threshold:
            fft_new_data[i] = 0

    # ifft get the value
    ifft_new_data = fft.ifft(fft_new_data).real
    plt.xlabel('Date')
    plt.plot_date(days, data, "b", label="original")
    plt.plot_date(days, ifft_new_data, "r", label="afterFFT")
    plt.legend()
    plt.show()
    return ifft_new_data

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
new_data["new_confirmed_after_fft"] = fftFilter(new_confirms)
new_data["total_deaths"] = deaths
new_data["new_deaths"] = new_death
new_data["new_death_after_fft"] = fftFilter(new_death)
new_data["total_recovered"] = recovered



new_csv = pd.DataFrame(new_data)
new_csv.to_csv("./mydata/US.csv")