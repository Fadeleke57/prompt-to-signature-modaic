import logging

# Get the univorn logger for the same CLI look
logger = logging.getLogger("uvicorn")

logger.info("GET request received at root endpoint")
logger.error("This is a test error.")