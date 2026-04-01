# Curiosity Report

## Topic: Load Testing vs Stress Testing vs Chaos Testing

### Overview
I chose this topic because during the course I used K6 for load testing and I will work with chaos testing soon in the JWT Pizza project. This made me curious about how different types of testing—load, stress, and chaos—relate to each other and when each should be used.

### What is GitOps?
**GitOps** is a set of practices that use Git repositories as the source of truth for defining and managing infrastructure and application configurations. GitOps takes the idea of “Infrastructure as Code” (IaC) to the next level by making Git the center of deployment pipelines. 

The two biggest hallmarks of GitOps:
1. **Declarative Configuration**: All environments and configurations are declared in version-controlled files (usually YAML or JSON).
2. **Pull-based Deployments**: Tools like [Argo CD](https://argoproj.github.io/argo-cd/) or [Flux](https://fluxcd.io/) “pull” changes from Git and synchronize them with the live environment. This model differs from the more traditional “push” model, where a CI/CD server pushes new configurations to the environment.

### Comparing GitOps and DevOps
While **DevOps** is a broad term describing the culture and methodologies combining development and operations, **GitOps** is a specific strategy or methodology that can be implemented within a DevOps environment. Here’s a quick comparison:

### Key Differences

| Testing Type   | Goal                          | How It Works                          | When It’s Used                         | Example |
|----------------|------------------------------|---------------------------------------|----------------------------------------|--------|
| Load Testing   | Verify system handles expected traffic | Simulates normal user behavior        | Before production to ensure stability   | K6 simulating users ordering pizza |
| Stress Testing | Find system limits and breaking point | Gradually increases load beyond normal | To understand capacity and failure points | Increasing users until requests fail |
| Chaos Testing  | Test system resilience to failures | Intentionally breaks parts of system   | In production-like environments to test reliability | Shutting down a service or adding latency |

In essence, GitOps provides a clear and auditable pipeline for changes, significantly reducing the friction of environment drift and configuration errors.

### Why is GitOps Useful?
- **Single Source of Truth**: Having all configuration in Git makes it easy to track changes over time.
- **Easier Rollbacks**: Revert to a previous commit, and the GitOps controller will automatically sync.
- **Better Collaboration**: Developers and Ops teams can collaborate via pull requests, code reviews, and Git’s branching model.
- **Scalability**: Particularly in Kubernetes clusters, GitOps tools can manage hundreds of microservices across multiple clusters by simply watching a Git repository.

### Tools and Getting Started
- **Argo CD**: A popular GitOps continuous delivery tool for Kubernetes. It monitors Git repos and applies changes to clusters.
- **Flux**: A set of continuous and progressive delivery solutions for Kubernetes that works in a similar pull-based manner.
- **Helm** (with GitOps Wrappers): Helm alone is not GitOps, but you can manage Helm charts declaratively and let Argo CD or Flux handle syncing.

### Personal Takeaways
- **Declarative Over Imperative**: It reinforced the principle of treating infrastructure just like code—version-controlled, reviewable, and auditable.
- **Reliability & Repeatability**: Pull-based deployments reduce the possibility of partial updates and environment drift.
- **Culture Shift**: While GitOps is a methodology, it requires a DevOps-minded culture for effective collaboration between Dev and Ops teams.

### References
- [Grafana K6](https://grafana.com/docs/k6/latest/)
- [Load testing applications](https://docs.aws.amazon.com/prescriptive-guidance/latest/load-testing/welcome.html)
- [PRINCIPLES OF CHAOS ENGINEERING](https://principlesofchaos.org/)
- [Implementing chaos engineering on AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/chaos-engineering-on-aws/implementation.html)
- [What is Stress Testing in Software Testing?](https://www.geeksforgeeks.org/software-testing/stress-testing-software-testing/)

---

