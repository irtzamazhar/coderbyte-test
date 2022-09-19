const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate = TRIVIAL_PARTITION_KEY;

  /**
   * refacotring explanation
   * I passed TRIVIAL_PARTITION_KEY value in candidate variable as a default if there no value passed to the function.
   * I added candidate check inside event condition because candidate variable value modifies only when we have some value in event variable.
   * 
   */
  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }

    if (candidate) {
      if (typeof candidate !== "string") {
        candidate = JSON.stringify(candidate);
      }
      if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
      }
    }
  }
  return candidate;
};