# Curiosity Report

## Topic: Load Testing vs Stress Testing vs Chaos Testing

### Overview
I chose this topic because during the course I used K6 for load testing and I will work with chaos testing soon in the JWT Pizza project. This made me curious about how different types of testing—load, stress, and chaos—relate to each other and when each should be used.

### What is load testing?
Load testing are tests that check how a system handles typical expected normal traffic. It is useful to make sure the system can handle the expected traffic it is going to have and to measure the response and performance times of the system. It can also help verify whether or not the system is production ready. 

### What is stress testing?
Stress testing is pushing the system beyond its limits to see when it breaks and how much it can handle. This is used to Find the systems maxiumum capacity and to understand the system weakpoints and how they can be improved. It is also used to understand how and where the system fails under intense unexpected pressure. 

### What is chaos testing?
Chaos testing is when you break part of the program on purpose to see how it handles failures and recovery. This is used to test to see if the system could recover and bounce back from a major failure. It is also used to test its alerting systems and provid practice for real incident responses. 

### Key Differences

| Testing Type   | Goal                          | How It Works                          | When It’s Used                         | Example |
|----------------|------------------------------|---------------------------------------|----------------------------------------|--------|
| Load Testing   | Verify system handles expected traffic | Simulates normal user behavior        | Before production to ensure stability   | K6 simulating users ordering pizza |
| Stress Testing | Find system limits and breaking point | Gradually increases load beyond normal | To understand capacity and failure points | Increasing users until requests fail |
| Chaos Testing  | Test system resilience to failures | Intentionally breaks parts of system   | In production-like environments to test reliability | Shutting down a service or adding latency |

### What kind of errors are prevented by doing testing?
- Like discussed above load testing tests normal expected activity to confirm that a system can handle normal user traffic. This helps prevent slow response times during everyday use and ensures the user has a good experience. Without these tests a system might work perfectly in development but completely fail when exposed to real users.
- Stress testing is important becuase without testing how far you can push a system you do not know its breaking points. You also do not have a good idea on how to scale it. Without these tests your program might fail at a crucial time such as a sales event, launch or suden traffic spikes.
- Chaos testing is important becuase in the real world unexpected failures happen such as server crashes or network failures. If you have done chaos testing you are alerted and know how to respond to the crisis which can help avoid major outages and shorten outage downtime thus potentially saving thousands to millions of dollers that would have been lost during that downtime.
- Together, these testing strategies ensure that a system is not only fast under normal conditions, but also stable under pressure and resilient when failures occur. June 12th 2025 Cloudflare pushed an update that disrupted many services losing billions of dollars worldwide. This serves as a reminder as to why testing is so crucial.
- 
### Tools used to do these tests
-There are a variety of different tools used to do load, stress and chaos testing. Some common load and stress testing options are k6, jmeter and locust which can all simulate user traffic at different levels. In this course we used k6 recently to perform load testing on jwt pizza. 
-For chaos testing different types of tools are used to intentionally indtroduce failures into the system. Populer choices for chaos testing are Chaos Monkey, Gremlin and LitmusChaos. 
-Platforms such as aws and grafana support these testing methods by providing infastructure, monitoring and visualization to aid in the testing but the actual tests are performed by specific tools such as k6. 

### Personal Takeaways
- Before this I thought that load testing alone was good enough. Now I understand that load testing only verifies performace under normal circumstances. More testing is required to make a sound program besides just load testing.
- Another thing I learned was that observability is just as important as testing. Metrics, logs and alerts are essential to understand what is wrong with the system and how to fix it.
- Another thing I learned was that real world systems are extremly unpredicatble and can unexpectedly crash or have problems so being prepared with testing to better understand the system is essential.
- Lastly I learned that Devops is not just about deployment its about reliability. A large part of devops is about observability and testing to make the systems reliable and easy to fix.

### Conclusion
- While the course introduced load testing and chaos testing, I still did not understand how these approaches differ or when each should be used. This led me to explore how load testing, stress testing, and chaos testing work together to improve system reliability.


### References
- [Grafana K6](https://grafana.com/docs/k6/latest/)
- [Load testing applications](https://docs.aws.amazon.com/prescriptive-guidance/latest/load-testing/welcome.html)
- [PRINCIPLES OF CHAOS ENGINEERING](https://principlesofchaos.org/)
- [Implementing chaos engineering on AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/chaos-engineering-on-aws/implementation.html)
- [What is Stress Testing in Software Testing?](https://www.geeksforgeeks.org/software-testing/stress-testing-software-testing/)
- [Cloudflare service outage June 12, 2025](https://blog.cloudflare.com/cloudflare-service-outage-june-12-2025/)

---

