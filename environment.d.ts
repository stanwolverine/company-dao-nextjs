declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NFT_STORAGE_KEY: string;
    }
  }
}

export {}