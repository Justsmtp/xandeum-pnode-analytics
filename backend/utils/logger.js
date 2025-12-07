/ backend/utils/logger.js
import chalk from 'chalk';

class Logger {
  info(message) {
    console.log(chalk.blue(`ℹ️  [INFO] ${new Date().toISOString()} - ${message}`));
  }

  success(message) {
    console.log(chalk.green(`✅ [SUCCESS] ${new Date().toISOString()} - ${message}`));
  }

  warn(message) {
    console.log(chalk.yellow(`⚠️  [WARN] ${new Date().toISOString()} - ${message}`));
  }

  error(message) {
    console.log(chalk.red(`❌ [ERROR] ${new Date().toISOString()} - ${message}`));
  }

  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray(`🐛 [DEBUG] ${new Date().toISOString()} - ${message}`));
    }
  }
}

export const logger = new Logger();