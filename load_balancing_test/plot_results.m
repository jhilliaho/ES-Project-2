clear;
close all;

used_length = 1500;
mean_length = 20;
load('matlab_results');

values = table2array(loadbalancingresults);
timestamps = values(1:used_length,1);

% Show timestamps as minutes elapsed
timestamps = (timestamps - timestamps(1))/60000;
values = values(1:used_length,2);
avgs = [1:used_length];

for i = 1:used_length
    if i > used_length - mean_length
         avgs(i) = mean(values(i:used_length));
    else
        avgs(i) = mean(values(i:i+mean_length));
    end    
end

mean_values = avgs/1000;
plot(timestamps, mean_values)
title("System response time")
xlabel("Time (minutes)")
ylabel("Time (seconds)")
legend("Response time")