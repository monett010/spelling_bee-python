class LoadEnvVars {
    async getEnvVars () {
        const response = await fetch("env_vars.json");
        const json = await response.json();
        return json;
    }

}