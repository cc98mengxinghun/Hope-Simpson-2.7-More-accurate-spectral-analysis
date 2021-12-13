import pandas as pd
import os
import matplotlib.pyplot as plt
import datetime
import numpy as np
from scipy import fft
from scipy.signal import savgol_filter
from scipy.interpolate import make_interp_spline

dirPath = "./COVID-19/csse_covid_19_data/csse_covid_19_daily_reports_us"


def get_data(state_name, dirPath):
    days = []
    confirms = []
    deaths = []
    recovered = []
    files = os.listdir(dirPath)
    for file in files:
        if not os.path.isdir(dirPath + '/' + file) and file != "README.md":
            dayData = pd.read_csv(
                dirPath + '/' + file).set_index("Province_State")
            dayData = dayData.fillna(0)
            days.append(datetime.datetime.strptime(
                dayData.loc[state_name].Last_Update.split(" ")[0], '%Y-%m-%d'))
            confirms.append(dayData.loc[state_name].Confirmed)
            deaths.append(dayData.loc[state_name].Deaths)
            recovered.append(dayData.loc[state_name].Recovered)
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


# get confirms and new cofirms every16Day
day_confirm_data.sort(key=takeFirst)
days = []
days_7 = []
confirms_7 = []
deaths_7 = []
recovered_7 = []
new_confirms_7 = []
new_death_7 = []
new_recovered_7 = []
for i in range(1, len(day_confirm_data)):
    days.append(day_confirm_data[i][0])
    if i % 7 == 1:
        days_7.append(day_confirm_data[i][0])
        confirms_7.append(day_confirm_data[i][1])
        deaths_7.append(day_confirm_data[i][2])
        recovered_7.append(day_confirm_data[i][3])
        new_confirms_7.append(
            day_confirm_data[i][1] - day_confirm_data[i-1][1])
        new_death_7.append(day_confirm_data[i][2] - day_confirm_data[i-1][2])
        new_recovered_7.append(
            day_confirm_data[i][3] - day_confirm_data[i-1][3])

# plot original picture
# plt.plot_date(days, new_confirms, "r")
# plt.show()


# Make_interp_spline
x_smooth = np.linspace(0, len(days), len(days_7))
is_new_confirms = make_interp_spline(x_smooth, new_confirms_7)(x_smooth)
is_new_death = make_interp_spline(x_smooth, new_death_7)(x_smooth)


# save data to csv
new_data_7 = {}
str_date_7 = []
for i in range(len(days_7)):
    str_date_7.append(days_7[i].strftime('%Y-%m-%d'))

new_data_7["date"] = str_date_7
new_data_7["total_confirmed"] = confirms_7
new_data_7["new_confirmed"] = new_confirms_7
new_data_7["new_confirmed_after_interp_spline"] = is_new_confirms
new_data_7["total_deaths"] = deaths_7
new_data_7["new_deaths"] = new_death_7
new_data_7["new_death_after_interp_spline"] = is_new_death
new_data_7["total_recovered"] = recovered_7

new_csv_7 = pd.DataFrame(new_data_7)
new_csv_7.to_csv("./mydata/Texas_is.csv")
