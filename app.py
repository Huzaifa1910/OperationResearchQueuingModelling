from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import math
import time
from tabulate import tabulate
import matplotlib.pyplot as plt


app = Flask(__name__)
df_new=pd.DataFrame()

# #step 3 --- youve to work on it, not using it rn

# print("Units of time: \n")
# print("""
#             1. seconds
#             2. minutes
#             3. hours
#             4. days
# """)

# unit_time_arrival=int(input("From the above mentioned units of time, choose one for the arrival time.\nEnter integer values(1, 2, 3 OR 4)."))
# unit_time_service=int(input("From the above mentioned units of time, choose one for the service time.\nEnter integer values(1, 2, 3 OR 4)."))

# *************************************

plot_df = pd.DataFrame()

@app.route('/')
def index():
    return render_template('index.html')

def calculate_mm1(arrival_mean, service_mean):
    # in M/M/C, the inter-arrival and service time, both follows the exponential distribution.
    
    # Get the current system time in seconds
    current_time = time.time()

    # Convert the time to microseconds and take the remainder when divided by 2**32
    microseconds = int(current_time * 1000000) % 2**32

    # Set the seed value to the current system time in microseconds
    np.random.seed(microseconds)
    
    value1 = arrival_mean
    arrival_time = np.random.poisson(lam=value1, size=15)
    
    value2 = service_mean
    service_time= np.random.poisson(lam=value2, size=15)
    
    servers= 1
    
    # to make sure that neither the arrival time nor the service time is equal to zero:
    
    for i in range(15):
        if(arrival_time[i]==0):
            x=np.random.poisson(lam=value1)
            while x<1:
                x=np.random.poisson(lam=value1)
            arrival_time[i]=round(x)
            
        
    for i in range(15):
        if(service_time[i]==0):
            x=np.random.poisson(lam=value1)
            while x<1:
                x=np.random.poisson(lam=value1)
            service_time[i]=round(x)
                
    # utilization factor (p)
    p=value1/value2
    arrival_time.sort()
    df={"Arrival Time": arrival_time,
        "Service Time": service_time}
    df=pd.DataFrame(df)    
        
    start_time=[]
    end_time=[]
    turnaround_time=[]
    wait_time=[]
    response_time=[]
    interarrival_time=[]

    n = df["Arrival Time"].count()

    start_time.append(df["Arrival Time"][0])
    interarrival_time.append(0)

    if df["Arrival Time"][1]>=df["Service Time"][0]:
        start_time.append(df["Arrival Time"][1])
        j=2
        for i in range(n-2):

            start_time.append(start_time[j-1]+df["Service Time"][j-1])
            j+=1

    else:
        j=1
        for i in range(n-1):

            start_time.append(start_time[j-1]+df["Service Time"][j-1])
            j+=1

    j=1
    for i in range(n-1):

        interarrival_time.append(df["Arrival Time"][j]-df["Arrival Time"][j-1])
        j+=1

    for i in range(n):

        end_time.append(start_time[i]+df["Service Time"][i])
        turnaround_time.append(end_time[i]-df["Arrival Time"][i])
        wait_time.append(turnaround_time[i]-df["Service Time"][i])
        response_time.append(start_time[i]-df["Arrival Time"][i])

    df["InterArrival Time"]=interarrival_time    
    df["Start Time"]=start_time
    df["End Time"] = end_time
    df["Turnaround Time"]=turnaround_time
    df["Wait Time"]=wait_time
    df["Response Time"] = response_time
    
    plot_df = df
    
    df_new["Arrival Time (in mins)"]=arrival_time
    df_new["Service Time (in mins)"]=service_time
    df_new["InterArrival Time (in mins)"]=interarrival_time
    
    print(df_new)
    simVals = {
        # "Arrival Time": arrival_time.tolist(),
        # "Service Time": service_time.tolist(),
        "InterArrival Time": interarrival_time
    }
    interarrival_time = np.array(interarrival_time)
    turnaround_time = np.array(turnaround_time)
    wait_time = np.array(wait_time)
    response_time = np.array(response_time)
    start_time = np.array(start_time)
    end_time = np.array(end_time)
    # arrival_time == lambda
    # service_time == mu

    # average number of customers in the system:
    # L = λ / (μ - λ)

    L =  value1 / (value2 - value1)

    # Average number of customers in the queue:
    # Lq = λ^2 / (μ (μ - λ))

    Lq = pow(value1, 2) / (value2 * (value2 - value1))

    # Average waiting time in the queue:
    # Wq = Lq / λ

    Wq = Lq/value1

    # Average time in the system
    # W = Wq + 1/μ

    W = Wq + 1/value2

    # probability of zero customers to wait
    # P0 = (μ / (μ - λ))^C

    P0 = 1-(value1/value2)

        # MM1 report: 

    avg_service_time= df["Service Time"].mean()
    avg_interarrival_time=df["InterArrival Time"].mean()
    avg_waiting_time_sys=df["Wait Time"].mean()
    avg_waiting_time_queue=df["Wait Time"].sum()/df["Wait Time"][df["Wait Time"]!=0].count()
    avg_cust_time_sys=df["Turnaround Time"].sum()/df["Arrival Time"].count()
    avg_response_time=df["Response Time"].mean()
    avg_utilization_rate=1-(1/df["Service Time"].sum())

    df_result={
        "MM1 Report":{
            "average service time": avg_service_time,
            "average inter-arrival time": avg_interarrival_time,
            "average waiting time": avg_waiting_time_sys,
            "average waiting time for those who wait": avg_waiting_time_sys,
            "average customer time in the system": avg_cust_time_sys,
            "average response time": avg_response_time,
            "average number of customers in the system": L,
            "average number of customers in the queue": Lq,
            "average waiting time in the queue": Wq,
            "average time in the system": W,
            "probability of zero customers to wait":P0,
            "utilization factor":p,
            "Arrival Time": arrival_time.tolist(),
            "Service Time": service_time.tolist(),
            "InterArrival Time": interarrival_time.tolist(),
            "Turnaround Time": turnaround_time.tolist(),
            "Wait Time": wait_time.tolist(),
            "Response Time": response_time.tolist(),
            "Start Time": start_time.tolist(),
            "End Time": end_time.tolist()



            }}
    results = [
        df_result,
        simVals
    ]
    return df_result["MM1 Report"]
    # df_result=pd.DataFrame(df_result)
    # print("\nPerformance measures: \n")
    # print(tabulate(df_result, headers='keys', tablefmt='github'))
    # Your MM1 calculations here
    # ...

def calculate_mm2(arrival_mean, service_mean):
    # in M/M/C, the inter-arrival and service time, both follows the exponential distribution.
    
    # Get the current system time in seconds
    current_time = time.time()

    # Convert the time to microseconds and take the remainder when divided by 2**32
    microseconds = int(current_time * 1000000) % 2**32

    # Set the seed value to the current system time in microseconds
    np.random.seed(microseconds)
    
    value1 = arrival_mean #arrival
    arrival_time = np.random.poisson(lam=value1, size=15)
    
    value2 = service_mean
    service_time= np.random.poisson(lam=value2, size=15)
    
    servers= 2
    
    # to make sure that neither the arrival time nor the service time is equal to zero:
    
    for i in range(15):
        if(arrival_time[i]==0):
            x=np.random.poisson(lam=value1)
            while x<1:
                x=np.random.poisson(lam=value1)
            arrival_time[i]=round(x)
            
        
    for i in range(15):
        if(service_time[i]==0):
            x=np.random.poisson(lam=value1)
            while x<1:
                x=np.random.poisson(lam=value1)
            service_time[i]=round(x)
                
    # utilization factor (p)
    p=value1/value2
    arrival_time.sort()
    df={"Arrival Time": arrival_time,
        "Service Time": service_time}
    df=pd.DataFrame(df)  

    start_time=[]
    end_time=[]
    interarrival_time=[]
    server=[]
    turnaround_time=[]
    wait_time=[]
    response_time=[]
    end_time_s1=[]
    end_time_s2=[]
    service_time_s1=[]
    service_time_s2=[]

    s1="Server 1"
    s2="Server 2"

    n = df["Arrival Time"].count()


    # the 1st customer will go to server 1 

    server.append(s1)
    start_time.append(df["Arrival Time"][0])
    end_time.append(start_time[0]+df["Service Time"][0])
    end_time_s1.append(end_time[0])
    interarrival_time.append(0)
    service_time_s1.append(df["Service Time"][0])

    # for the next customer, we check if server 1 is free, if not, then this customer goes to server 2

    j=0
    k=1
    z=0
    ss1=0
    ss2=0
    for i in range(n-1):
        if(end_time[j]>df["Arrival Time"][k] and server[j]==s1):

            server.append(s2)

            # we will check if this is the 1st customer of server 2

            if(z==0):
                start_time.append(df["Arrival Time"][k])
                z=1
            else:
                # we will check if server 2 is free

                if(df["Arrival Time"][k]<end_time_s2[-1]):
                    start_time.append(end_time_s2[-1])
                else:
                    start_time.append(df["Arrival Time"][k])

            end_time.append(start_time[k]+df['Service Time'][k])
            end_time_s2.append(end_time[k])
            service_time_s2.append(df["Service Time"][k])


        else:

            server.append(s1)

            if(df["Arrival Time"][k]<end_time_s1[-1]):
                start_time.append(end_time_s1[-1])
            else:
                start_time.append(df["Arrival Time"][k])

            end_time.append(start_time[k]+df["Service Time"][k])
            end_time_s1.append(end_time[k])
            service_time_s1.append(df["Service Time"][k])


        j+=1
        k+=1

    j=1

    for i in range(n-1):

        interarrival_time.append(df["Arrival Time"][j]-df["Arrival Time"][j-1])
        j+=1


    for i in range(n):

        turnaround_time.append(end_time[i]-df["Arrival Time"][i])
        wait_time.append(turnaround_time[i]-df["Service Time"][i])
        response_time.append(start_time[i]-df["Arrival Time"][i])

    # df has the calculated values of waiting time, turaround time and response time.

    df["InterArrival Time"]=interarrival_time    
    df["Start Time"]=start_time
    df["End Time"] = end_time
    df["Turnaround Time"]=turnaround_time
    df["Wait Time"]=wait_time
    df["Response Time"] = response_time
    df["Server"] = server
    
    plot_df = df
            
    df_new["Arrival Time (in mins)"]=arrival_time
    df_new["Service Time (in mins)"]=service_time
    df_new["InterArrival Time (in mins)"]=interarrival_time
    
    print(df_new)
    
            
    #MM2 report

    avg_service_time= df["Service Time"].mean()
    avg_interarrival_time=df["InterArrival Time"].mean()
    avg_waiting_time_sys=df["Wait Time"].mean()
    avg_waiting_time_queue=df["Wait Time"].sum()/df["Wait Time"][df["Wait Time"]!=0].count()
    avg_cust_time_sys=df["Turnaround Time"].sum()/df["Arrival Time"].count()
    avg_response_time=df["Response Time"].mean()
    avg_utilization_rate=1-(1/df["Service Time"].sum())
    utilization_rate_s1=(sum(service_time_s1)/df['Service Time'].sum())
    utilization_rate_s2=(sum(service_time_s2)/df['Service Time'].sum())
    proportion_idletime_s1=1-utilization_rate_s1
    proportion_idletime_s2=1-utilization_rate_s2
    P_cust_to_wait=df["Wait Time"][df["Wait Time"]!=0].count()/df["Wait Time"].count()

    
    # arrival_time == lambda
    # service_time == mu
    interarrival_time = np.array(interarrival_time)
    turnaround_time = np.array(turnaround_time)
    wait_time = np.array(wait_time)
    response_time = np.array(response_time)
    start_time = np.array(start_time)
    end_time = np.array(end_time)
    # average number of customers in the system:
    # L = λ / (μ - λ)

    L =  value1 / (value2 - value1)

    # Average number of customers in the queue:
    # Lq = λ^2 / (μ (μ - λ))

    Lq = pow(value1, 2) / (value2 * (value2 - value1))

    # Average waiting time in the queue:
    # Wq = Lq / λ

    Wq = Lq/value1

    # Average time in the system
    # W = Wq + 1/μ

    W = Wq + 1/value2

    # probability of zero customers to wait
    # P0 = (μ / (μ - λ))^C

    P0 = 1-(value1/value2)
                                                                        
    df_result={
        "MM2 Report":{
            "average service time": avg_service_time,
            "average inter-arrival time": avg_interarrival_time,
            "average waiting time": avg_waiting_time_sys,
            "average waiting time for those who wait": avg_waiting_time_queue,
            "average customer time in the system": avg_cust_time_sys,
            "average response time": avg_response_time,
            "utilization rate of server 1": utilization_rate_s1,
            "utilization rate of server 2": utilization_rate_s2,
            "proportion of idle time of server 1": proportion_idletime_s1,
            "proportion of idle time of server 2": proportion_idletime_s2,
            "Probability of customers to wait": P_cust_to_wait,
            "Probability of zero customers to wait": 1-P_cust_to_wait,
            "average number of customers in the system": L,
            "average number of customers in the queue": Lq,
            "average waiting time in the queue": Wq,
            "average time in the system": W,
            "probability of zero customers to wait":P0,
            "utilization factor":p,
             "Arrival Time": arrival_time.tolist(),
            "Service Time": service_time.tolist(),
            "InterArrival Time": interarrival_time.tolist(),
            "Turnaround Time": turnaround_time.tolist(),
            "Wait Time": wait_time.tolist(),
            "Response Time": response_time.tolist(),
            "Start Time": start_time.tolist(),
            "End Time": end_time.tolist(),
            "Servers": server
        }}
    return df_result["MM2 Report"]
    # df_result=pd.DataFrame(df_result)
    # print("\nPerformance measures: \n")
    # print(tabulate(df_result, headers='keys', tablefmt='github'))
    
    # Your MM2 calculations here
    # ...

def calculate_mg1(arrival_mean, service_distribution, values):
    # in M/G/C, the arrival time follows the exponential distribution whereas the service time can be of any distribution 
    
    value1 = arrival_mean #arrival
    arrival_time = np.random.poisson(lam=value1, size=15)
    
        
    # to make sure that neither the arrival time is not equal to zero:
    
    for i in range(15):
        if(arrival_time[i]==0):
            x=np.random.poisson(lam=value1)
            while x<1:
                x=np.random.poisson(lam=value1)
            arrival_time[i]=round(x)
                
    print("Distributions:")
    print("""
                1. Uniform
                2. Gamma
                3. Normal
    """)    
     
    
    service_time=0
        
    if(service_distribution==1):
        
        low=values[0]
        high=values[1]
        uniform_service=np.random.uniform(low=low, high=high, size=15)
        service_time=[]
        for i in range(15):
            service_time.append(round(uniform_service[i]))      
        value2= 2/(high+low)
        
        # to make sure that service time is not equal to zero: 
        
        for i in range(15):
            if(service_time[i]==0):
                x=np.random.uniform(low=low, high=high)
                while x<1:
                    x=np.random.uniform(low=low, high=high)
                service_time[i]=round(x)

        
    elif(service_distribution==2):
        
        mean=values[0]
        var_service=values[1]
        shape=values[2]
        scale=math.sqrt(var_service)
        gamma_service=np.random.gamma(shape= shape, scale=scale, size=15)
        service_time=[]
        for i in range(15):
            service_time.append(round(gamma_service[i]))
        value2=shape*scale  
        value1=mean        
        
        # to make sure that service time is not equal to zero: 
        
        for i in range(15):
            if(service_time[i]==0):
                x=np.random.gamma(shape= shape, scale=scale)
                while x<1:
                    x=np.random.gamma(shape= shape, scale=scale)
                service_time[i]=round(x)


    else:
        
        mean=values[0]
        var_service=values[1]
        sd=math.sqrt(var_service)
        normal_service=np.random.normal(loc=mean, scale=sd, size=15)
        service_time=[]
        for i in range(15):
            service_time.append(round(normal_service[i]))
        value2=mean       
               
        # to make sure that service time is not equal to zero: 
        
        for i in range(15):
            if(service_time[i]==0):
                x=np.random.normal(loc=mean, scale=sd)
                while x<1:
                    x=np.random.normal(loc=mean, scale=sd)
                service_time[i]=round(x)

    arrival_time.sort()
    df={"Arrival Time": arrival_time,
        "Service Time": service_time}
    df=pd.DataFrame(df)
    print(df)

    start_time=[]
    end_time=[]
    turnaround_time=[]
    wait_time=[]
    response_time=[]
    interarrival_time=[]

    n = df["Arrival Time"].count()

    start_time.append(df["Arrival Time"][0])
    interarrival_time.append(0)

    if df["Arrival Time"][1]>=df["Service Time"][0]:
        start_time.append(df["Arrival Time"][1])
        j=2
        for i in range(n-2):

            start_time.append(start_time[j-1]+df["Service Time"][j-1])
            j+=1

    else:
        j=1
        for i in range(n-1):

            start_time.append(start_time[j-1]+df["Service Time"][j-1])
            j+=1

    j=1
    for i in range(n-1):

        interarrival_time.append(df["Arrival Time"][j]-df["Arrival Time"][j-1])
        j+=1

    for i in range(n):

        end_time.append(start_time[i]+df["Service Time"][i])
        turnaround_time.append(end_time[i]-df["Arrival Time"][i])
        wait_time.append(turnaround_time[i]-df["Service Time"][i])
        response_time.append(start_time[i]-df["Arrival Time"][i])

    df["InterArrival Time"]=interarrival_time    
    df["Start Time"]=start_time
    df["End Time"] = end_time
    df["Turnaround Time"]=turnaround_time
    df["Wait Time"]=wait_time
    df["Response Time"] = response_time
    
    plot_df = df
    
    df_new["Arrival Time (in mins)"]=arrival_time
    df_new["Service Time (in mins)"]=service_time
    df_new["InterArrival Time (in mins)"]=interarrival_time

    print(df_new)
    service_time = np.array(service_time)
    arrival_time = np.array(arrival_time)    
    turnaround_time = np.array(turnaround_time)
    interarrival_time = np.array(interarrival_time)
    wait_time = np.array(wait_time)
    response_time = np.array(response_time)
    start_time = np.array(start_time)
    end_time = np.array(end_time)
    
    arrival_mean=1/value1
    service_mean=value2

    # utilization factor (p)

    p=arrival_mean/service_mean

    # Average number of customers in the queue:

    s = pow((high-low),2)/12
    Lq = (pow(arrival_mean, 2)*pow(s,2) + pow(p,2)) / (2*(1-p))

    # Average waiting time in the queue:
    # Wq = Lq / λ

    Wq = Lq/arrival_mean


    # Average time in the system
    # W = Wq + 1/μ

    W = Wq + 1/service_mean

    # average number of customers in the system:
    L=arrival_mean*W

    # proportion of idle time of server

    idle_time=1-p

    # probability of zero customers to wait
    # P0 = (μ / (μ - λ))^C

    P0 = 1-(arrival_mean/service_mean)


    result={"M/G/1 REPORT": {
            "average number of customers in the system": L,
            "average number of customers in the queue": Lq,
            "average waiting time in the queue": Wq,
            "average time in the system": W,
            "probability of zero customers to wait":P0,
            "proportion of idle time of server":idle_time,
            "utilization factor":p,
            "Arrival Time": arrival_time.tolist(),
            "Service Time": service_time.tolist(),
            "InterArrival Time": interarrival_time.tolist(),
            "Turnaround Time": turnaround_time.tolist(),
            "Wait Time": wait_time.tolist(),
            "Response Time": response_time.tolist(),
            "Start Time": start_time.tolist(),
            "End Time": end_time.tolist(),
           }}
    return result["M/G/1 REPORT"]
    # result=pd.DataFrame(result)
    # print(tabulate(result, headers='keys', tablefmt='github'))
    # Your MG1 calculations here
    # ...

def calculate_gg1(arrival_distribution, service_distribution, arrival_values, service_values):
     # in G/G/C, both the arrival time and the service time can follow any of the distribution.
    
    print("Distributions:")
    print("""
                1. Uniform
                2. Gamma
                3. Normal
    """) 
    
    arrival_time=0
    var_arrival=0
    service_time=0
    var_service=0
    
            
    if(arrival_distribution==1):
        
        low=arrival_values[0]
        high=arrival_values[1]
        uniform_arrival=np.random.uniform(low=low, high=high, size=15)
        var_arrival=float(input("\nEnter the variance of arrival time: "))
        arrival_time=[]
        value1=2/(high+low)
        
        for i in range(15):
            arrival_time.append(round(uniform_arrival[i]))
                               
        # to make sure that arrival time is not equal to zero: 
        
        for i in range(15):
            if(arrival_time[i]==0):
                x=np.random.uniform(low=low, high=high)
                while x<1:
                    x=np.random.uniform(low=low, high=high)
                arrival_time[i]=round(x)

        
    elif(arrival_distribution==2):
        
        mean=arrival_values[0]
        var_arrival=arrival_values[1]
        shape=arrival_values[2]
        print(shape)
        scale=math.sqrt(var_arrival)
        gamma_arrival=np.random.gamma(shape= shape, scale=scale, size=15)
        arrival_time=[]
        value1=mean
                
        for i in range(15):
            arrival_time.append(round(gamma_arrival[i]))
                               
        # to make sure that arrival time is not equal to zero: 
        
        for i in range(15):
            if(arrival_time[i]==0):
                x=np.random.gamma(shape= shape, scale=scale)
                while x<1:
                    x=np.random.gamma(shape= shape, scale=scale)
                arrival_time[i]=round(x)

    else:
                
        mean=arrival_values[0]
        var_arrival=arrival_values[1]
        sd=math.sqrt(var_arrival)
        normal_arrival=np.random.normal(loc=mean, scale=sd, size=15)
        arrival_time=[]
        value1=mean
                                       
        for i in range(15):
            arrival_time.append(round(normal_arrival[i]))
            
        # to make sure that arrival time is not equal to zero: 
        
        for i in range(15):
            if(arrival_time[i]==0):
                x=np.random.normal(loc=mean, scale=sd)
                while x<1:
                    x=np.random.normal(loc=mean, scale=sd)
                arrival_time[i]=round(x)

        
    print("""
                1. Uniform
                2. Gamma
                3. Normal
    """) 


    
        
       
    if(service_distribution==1):
        
        low=service_values[0]
        high=service_values[1]
        uniform_service=np.random.uniform(low=low, high=high, size=15)
        var_service=float(input("\nEnter the variance of service time: "))
        service_time=[]
        value2=2/(high+low)
        
        for i in range(15):
            service_time.append(round(uniform_service[i]))
                                               
        # to make sure that service time is not equal to zero: 
        
        for i in range(15):
            if(service_time[i]==0):
                x=np.random.uniform(low=low, high=high)
                while x<1:
                    x=np.random.uniform(low=low, high=high)
                service_time[i]=round(x)

    elif(service_distribution==2):
        
        mean=service_values[0]
        var_service=service_values[1]
        shape=service_values[2]
        scale=math.sqrt(var_service)
        gamma_service=np.random.gamma(shape= shape, scale=scale, size=15)
        service_time=[]
        value2=shape*scale
        
        for i in range(15):
            service_time.append(round(gamma_service[i]))
        
        print(service_time)                          
        # to make sure that service time is not equal to zero: 
        
        for i in range(15):
            if(service_time[i]==0):
                x=np.random.gamma(shape= shape, scale=scale)
                while x<1:
                    x=np.random.gamma(shape= shape, scale=scale)
                service_time[i]=round(x)

    else:
                # *******************************************************
        mean=service_values[0]
        var_service=service_values[1]
        sd=math.sqrt(var_service)
        normal_service=np.random.normal(loc=mean, scale=sd, size=15)
        service_time=[]
        value2=mean
        
        for i in range(15):
            service_time.append(round(normal_service[i]))
        
                                                               
        # to make sure that service time is not equal to zero: 
        
        for i in range(15):
            if(service_time[i]==0):
                x=np.random.normal(loc=mean, scale=sd)
                while x<1:
                    x=np.random.normal(loc=mean, scale=sd)
                service_time[i]=round(x)

    # utilization factor (p)
    p=value1/value2
    arrival_time.sort()
    df={"Arrival Time": arrival_time,
        "Service Time": service_time}
    df=pd.DataFrame(df)
    print(df)
    
    start_time=[]
    end_time=[]
    turnaround_time=[]
    wait_time=[]
    response_time=[]
    interarrival_time=[]

    n = df["Arrival Time"].count()

    start_time.append(df["Arrival Time"][0])
    interarrival_time.append(0)

    if df["Arrival Time"][1]>=df["Service Time"][0]:
        start_time.append(df["Arrival Time"][1])
        j=2
        for i in range(n-2):

            start_time.append(start_time[j-1]+df["Service Time"][j-1])
            j+=1

    else:
        j=1
        for i in range(n-1):

            start_time.append(start_time[j-1]+df["Service Time"][j-1])
            j+=1

    j=1
    for i in range(n-1):

        interarrival_time.append(df["Arrival Time"][j]-df["Arrival Time"][j-1])
        j+=1

    for i in range(n):

        end_time.append(start_time[i]+df["Service Time"][i])
        turnaround_time.append(end_time[i]-df["Arrival Time"][i])
        wait_time.append(turnaround_time[i]-df["Service Time"][i])
        response_time.append(start_time[i]-df["Arrival Time"][i])

    df["InterArrival Time"]=interarrival_time    
    df["Start Time"]=start_time
    df["End Time"] = end_time
    df["Turnaround Time"]=turnaround_time
    df["Wait Time"]=wait_time
    df["Response Time"] = response_time
    
    plot_df = df

    df_new["Arrival Time (in mins)"]=arrival_time
    df_new["Service Time (in mins)"]=service_time
    df_new["InterArrival Time (in mins)"]=interarrival_time
    arrival_time = np.array(arrival_time)
    service_time = np.array(service_time)
    interarrival_time = np.array(interarrival_time)
    turnaround_time = np.array(turnaround_time)
    wait_time = np.array(wait_time)
    response_time = np.array(response_time)
    start_time = np.array(start_time)
    end_time = np.array(end_time)
    print(df_new)
    
    arrival_mean=1/value1
    service_mean=1/value2

    # p -> utilization factor

    p=arrival_mean/service_mean

    # coffecient of variance of inter-arrival time:

    Ca=var_arrival/pow((1/arrival_mean), 2)

    # coffecient of variance of service time:

    Cs=var_service/pow((1/service_mean), 2)

    # Average number of customers in the queue:

    Lq = (pow(p, 2)*(1+Cs)*(Ca+(pow(p, 2)*Cs)))/(2*(1-p)*(1+(pow(p, 2)*Cs)))
    # Average waiting time in the queue:
    # Wq = Lq / λ

    Wq = Lq/arrival_mean


    # Average time in the system
    # W = Wq + 1/μ

    W = Wq + (1/service_mean)

    # average number of customers in the system:
    L=arrival_mean*W

    # proportion of idle time of server

    idle_time=1-p

    # probability of zero customers to wait
    # P0 = (μ / (μ - λ))^C

    P0 = 1-(arrival_mean/service_mean)


    result={"G/G/1 REPORT": {
            "average number of customers in the system": L,
            "average number of customers in the queue": Lq,
            "average waiting time in the queue": Wq,
            "average time in the system": W,
            "probability of zero customers to wait":P0,
            "proportion of idle time of server":idle_time,
            "utilization factor":p,            
            "Arrival Time": arrival_time.tolist(),
            "Service Time": service_time.tolist(),
            "InterArrival Time": interarrival_time.tolist(),
            "Turnaround Time": turnaround_time.tolist(),
            "Wait Time": wait_time.tolist(),
            "Response Time": response_time.tolist(),
            "Start Time": start_time.tolist(),
            "End Time": end_time.tolist(),
           }}
    return result["G/G/1 REPORT"]
    # result=pd.DataFrame(result)
    # print(tabulate(result, headers='keys', tablefmt='github'))
    # Your GG1 calculations here
    # ...

@app.route('/mm1', methods=['POST'])
def mm1():
    data = request.json
    arrival_mean = data['arrival_mean']
    service_mean = data['service_mean']
    result = calculate_mm1(arrival_mean, service_mean)
    print(result)
    return jsonify(result)

@app.route('/mm2', methods=['POST'])
def mm2():
    data = request.json
    arrival_mean = data['arrival_mean']
    service_mean = data['service_mean']
    result = calculate_mm2(arrival_mean, service_mean)
    return jsonify(result)

@app.route('/mg1', methods=['POST'])
def mg1():
    data = request.json
    arrival_mean = data['arrival_mean']
    service_distribution = data['distribution']
    values = data['values']
    result = calculate_mg1(arrival_mean, service_distribution, values)
    return jsonify(result)

@app.route('/gg1', methods=['POST'])
def gg1():
    data = request.json
    arrival_distribution = data['arrival_distribution']
    service_distribution = data['service_distribution']
    arrival_values = data['arrival_values']
    service_values = data['service_values']
    result = calculate_gg1(arrival_distribution, service_distribution,arrival_values, service_values)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
