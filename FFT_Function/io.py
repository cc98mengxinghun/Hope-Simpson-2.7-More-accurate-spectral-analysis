import pandas as pd
import os

dirPath ="./COVID-19/csse_covid_19_data/csse_covid_19_daily_reports_us"

def get_data(state_name, dirPath):
    days = []
    sicks = []
    Deaths = []
    recovered = []
    files = os.listdir(dirPath)
    for file in files:
        if not os.path.isdir(dirPath + '/' + file) and file != "README.md":
            dayData= pd.read_csv(dirPath + '/' + file).set_index("Province_State")
            dayData = dayData.fillna(0)
            days.append(dayData.loc[state_name].Last_Update.split(" ")[0])
            sicks.append(dayData.loc[state_name].Confirmed)
            Deaths.append(dayData.loc[state_name].Deaths)
            recovered.append(dayData.loc[state_name].Recovered)
    res = {}
    res["days"] = days
    res["sicks"] = sicks
    res["Deaths"] = Deaths
    res["recovered"] = recovered
    return res

data = get_data("Texas", dirPath)