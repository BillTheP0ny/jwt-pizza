By the end of the course you must do the following:

Pick a curiosity topic
Research the topic
Create a markdown file and insert it into your fork of the jwt-pizza repository in a file named curiosityReport.md.
Populate the markdown file with what you learned
Once you are done, go over to Canvas and submit the URL of your markdown file. Your URL should look something like this:

# Curiosity Report

## Topic: What is GitOps and How Is It Different from DevOps?

### Overview
I chose to investigate **GitOps** because it’s a topic I’ve heard mentioned in conversations around modern DevOps practices, especially when working with container orchestration platforms like Kubernetes. GitOps is often described as a more streamlined way to manage both infrastructure and application deployments by using Git as the single source of truth.

### What is GitOps?
**GitOps** is a set of practices that use Git repositories as the source of truth for defining and managing infrastructure and application configurations. GitOps takes the idea of “Infrastructure as Code” (IaC) to the next level by making Git the center of deployment pipelines. 

The two biggest hallmarks of GitOps:
1. **Declarative Configuration**: All environments and configurations are declared in version-controlled files (usually YAML or JSON).
2. **Pull-based Deployments**: Tools like [Argo CD](https://argoproj.github.io/argo-cd/) or [Flux](https://fluxcd.io/) “pull” changes from Git and synchronize them with the live environment. This model differs from the more traditional “push” model, where a CI/CD server pushes new configurations to the environment.

### Comparing GitOps and DevOps
While **DevOps** is a broad term describing the culture and methodologies combining development and operations, **GitOps** is a specific strategy or methodology that can be implemented within a DevOps environment. Here’s a quick comparison:

| Aspect            | DevOps (General)                            | GitOps (Specific Strategy)                |
|-------------------|---------------------------------------------|-------------------------------------------|
| **Focus**         | Automating software delivery & ops          | Managing everything (infra + apps) in Git |
| **Configuration** | Can be declarative or imperative            | Must be declarative (YAML, JSON, etc.)    |
| **Deployment Flow** | Often *push-based*: CI/CD pipelines trigger deployments | Typically *pull-based*: a controller continuously syncs changes from Git |
| **Source of Truth** | Various systems and tools; logs scattered across pipelines | Git repository is the single source of truth |
| **Rollback**      | May require custom scripts or manual effort | As easy as reverting to a previous commit |
| **Auditing**      | Can be scattered across multiple tools       | Entire history in Git commits and PRs     |

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
- [Argo CD Documentation](https://argo-cd.readthedocs.io/en/stable/)
- [Flux Documentation](https://fluxcd.io/docs/)
- [GitOps Website](https://www.gitops.tech/)
- [The GitOps FAQ by Weaveworks](https://www.weave.works/technologies/gitops/)

---

