export default {
    fileSystem: {
        path: './DB'
    },
    mongoDB: {
      URI: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.dlq60k1.mongodb.net/ecommerce?retryWrites=true&w=majority`,
    },
  }