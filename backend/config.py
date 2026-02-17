from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "PSX Stock Analyzer"
    debug: bool = False
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    psx_base_url: str = "https://dps.psx.com.pk/company"
    request_timeout: int = 30
    rate_limit: str = "10/minute"
    user_agent: str = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    )

    model_config = {"env_prefix": "PSX_", "env_file": ".env"}


settings = Settings()
