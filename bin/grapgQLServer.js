const { GraphQLServer } = require('graphql-yoga');
var ProductDetail = require('../model/Product');

const typeDefs = `
  type Query {
    allProducts(page: Int,pageSize: Int): [Product]
  }
  scalar Date

  type Product {
    name: String
    slug:String
    image:String
    description: String
    regular_price: String
    sale_price:String
    date_on_sale_from: Date
    date_on_sale_to: Date
    manage_stock: Boolean
    stock_quantity: Int
    sku: String
  },
  type Mutation {
    addProduct( name: String!, slug:String! ,image:String!
      ,description: String ,regular_price: String!
      ,sale_price:String      ,date_on_sale_from: Date
      ,date_on_sale_to: Date      ,manage_stock: Boolean
      ,stock_quantity: Int      ,sku: String!): Product!
  }
  
`

const resolvers = {
  Query: {
    allProducts: async (_, args) => {
      let result = await ProductDetail.find()
        .limit(parseInt(args.pageSize))
        .skip(parseInt(args.pageSize) * parseInt(args.page))
        .exec()
      return result;
    },
  },
  Mutation: {
    addProduct: async (parent, args) => {
      let newProduct = new ProductDetail({
        name: args.name,
        slug: args.slug,
        image: args.image,
        description: args.description,
        regular_price: args.regular_price,
        sale_price: args.sale_price,
        date_on_sale_from: args.date_on_sale_from,
        date_on_sale_to: args.date_on_sale_to,
        manage_stock: args.manage_stock,
        stock_quantity: args.stock_quantity,
        sku: args.sku
      });
      return await newProduct.save();
    }
  },
}
const options = {
  port: "4000",
  endpoint: "/graphql",
  playground: "/playground"
};

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(options, ({ port }) => {
  console.log(`graphQL ***** Server is running on http://localhost:${port}`);
});
