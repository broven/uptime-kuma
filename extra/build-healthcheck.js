const childProcess = require("child_process");
const fs = require("fs");
const platform = process.argv[2];

if (!platform) {
    console.error("No platform??");
    process.exit(1);
}

const env = {
    ...process.env,
    CGO_ENABLED: "0",
};

if (platform === "linux/arm/v7") {
    env.GOOS = "linux";
    env.GOARCH = "arm";
    env.GOARM = "7";
    console.log("Arch: armv7");
    if (fs.existsSync("./extra/healthcheck-armv7")) {
        fs.renameSync("./extra/healthcheck-armv7", "./extra/healthcheck");
        console.log("Already built in the host, skip.");
        process.exit(0);
    } else {
        console.log("prebuilt not found, it will be slow! You should execute `npm run build-healthcheck-armv7` before build.");
    }
} else if (platform === "linux/arm64") {
    env.GOOS = "linux";
    env.GOARCH = "arm64";
    console.log("Arch: arm64");
} else if (platform === "linux/amd64") {
    env.GOOS = "linux";
    env.GOARCH = "amd64";
    console.log("Arch: amd64");
}

if (platform !== "linux/arm/v7") {
    if (fs.existsSync("./extra/healthcheck-armv7")) {
        fs.rmSync("./extra/healthcheck-armv7");
    }
}

const output = childProcess.execSync("go build -x -o ./extra/healthcheck ./extra/healthcheck.go", { env: env }).toString("utf8");
console.log(output);
