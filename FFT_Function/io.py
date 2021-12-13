import pandas as pd
import os
import scipy
from scipy.signal import savgol_filter
import numpy as np
from matplotlib import pyplot as plt
from scipy.interpolate import make_interp_spline
from scipy.fftpack import fft

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

# asuming the data has two dimmention vector x and y
x = []
y = []
# Savitzky-Golay
y_smooth = scipy.signal.savgol_filter(y, 53, 3)
# y_smooth = (y,window_length,k)
# y：代表曲线点坐标（x,y）中的y值数组
# window_length：窗口长度，该值需为正奇整数。例如：此处取值53
# k值：polyorder为对窗口内的数据点进行k阶多项式拟合，k的值需要小于window_length
y_smooth2 = savgol_filter(y, 99, 1, mode='nearest')
# mode：确定了要应用滤波器的填充信号的扩展类型。（This determines the type of extension to use for the padded signal to which the filter is applied. ）

# make_interp_spline
# np.linspace 等差数列,从x.min()到x.max()生成300个数，便于后续插值
x_smooth = np.linspace(x.min(), x.max(), 300)
y_smooth = make_interp_spline(x, y)(x_smooth)

# convolve


def np_move_avg(a, n, mode="same"):
    return(np.convolve(a, np.ones((n,))/n, mode=mode))


modes = ['full', 'same', 'valid']

for m in modes:
    plt.plot(np_move_avg(x, y, mode=m))
# 返回x和y的离散线性卷积, mode:{‘full’, ‘valid’, ‘same’}参数可选，该参数指定np.convolve函数如何处理边缘。

noise_size = 1400
noise_array = np.random.normal(0, 2, noise_size)
adc_value = []
for i in range(noise_size):
    adc_value.append(0)
y = np.array(adc_value) + noise_array

yy = fft(y)  # 快速傅里叶变换
yf = abs(fft(y))        # 取模
yf1 = abs(fft(y))/((len(y)/2))  # 归一化处理
yf2 = yf1[range(int(len(y)/2))]  # 由于对称性，只取一半区间
# 混合波的FFT（双边频率范围）
xf = np.arange(len(y))
plt.figure(1)
plt.plot(xf, yf, 'r')  # 显示原始信号的FFT模值
plt.title('FFT of Mixed wave(two sides frequency range)',
          fontsize=7, color='#7A378B')  # 注意这里的颜色可以查询颜色代码表

yy = fft(y)  # 快速傅里叶变换
yreal = yy.real        # 获取实数部分
yimag = yy.imag        # 获取虚数部分
test_y = yy
for i in range(len(yy)):
    if i <= 1200 and i >= 200:
        test_y[i] = 0
test = fft.ifft(test_y)  # 对变换后的结果应用ifft函数，应该可以近似地还原初始信号。
y = test
yy = fft(y)  # 快速傅里叶变换
yf = abs(fft(y))        # 取模
yf1 = abs(fft(y))/((len(y)/2))  # 归一化处理
yf2 = yf1[range(int(len(y)/2))]  # 由于对称性，只取一半区间
# 混合波的FFT（双边频率范围）
xf = np.arange(len(y))
plt.figure(2)
plt.plot(xf, yf, 'r')  # 显示原始信号的FFT模值
plt.title('FFT of Mixed wave(two sides frequency range)',
          fontsize=7, color='#7A378B')  # 注意这里的颜色可以查询颜色代码表
