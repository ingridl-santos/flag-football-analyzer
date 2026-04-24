# How to Run

There are a few things that need to be in place so that we have the most seamless experience working with development containers.

## 1. Git Authentication
Your Host machine must have access to Wiley's GitHub repositories, that means your `git` access must have SSO access to the organization.

For Windows we recommend using [Git for Windows](https://gitforwindows.org/) with the default settings.

**If using Docker within WSL2**: You can tell WSL2 to use Git for Windows' credentials manager, that way it will be fully passed through from your Windows -> WSL2 -> Docker seamlessly, to do that you can issue the following command inside WSL2:\

If GIT installed is >= v2.36.1:\
`git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager-core.exe"`

else if version is < v2.36.1 enter this command:\
`git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/libexec/git-core/git-credential-manager.exe"`

#### You can verify that the credential helper was set correctly if it shows up when running `git config --global -l`

## 2. Git Identity
To be able to create commits you have to be identified, run the following commands in your Host machine:\
`git config --global user.name "FIRST_NAME LAST_NAME"`\
`git config --global user.email "USERNAME@wiley.com"`

**If using Docker within WSL2:** Make sure to repeat the above commands inside your WSL2 instance.

#### You can verify that your name and email were set correctly if they show up when running `git config --global -l`

## 3. Clone the project

When running Windows + WSL2 + Docker, the performance is really bad if you work with files within
your windows filesystem (it basically has to do a double copy from Windows -> WSL2 -> Docker for every file update), instead, clone
the repository directly inside your WSL2 instance if you value your time (anywhere that's not inside `/mnt/c`, for example, `~`).

If you're not running the above combo, you may clone the repository with no worries.

`git clone https://github.com/wiley/flag-football-analyzer.git`

## 4. Open the Project in VS Code
Now you may open the project, make sure you install the recommended extensions.\
But most important of all, install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.

You can open VSCode by going inside the project folder and running `code .`

## 5. Run the Dev Container
Make sure you finish setting up the project, for example, creating your `.env` file.

You can press `F1` and execute the option `Dev Container: Reopen in Container`, this will create (if it doesn't exist) and spin up your dev container.

If you added new packages to `package.json` make sure you run `Dev Container: Rebuild and Reopen in Container` so your base image gets updated with the new packages.
