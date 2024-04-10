const { Client } = require("@notionhq/client");

// const databases = {
//   mealprep: "e3e3e3....",
//   todos: "e3e3e3...."
// }

const enum DatabaseName {
  // https://www.notion.so/knowledgedump/abb8da437b3c42a183215270d26b089c?v=fabf6d8183934bf58e54e15f7ef0e601
  mealprep = "e3e3e3....",

  // https://www.notion.so/knowledgedump/8337658fc3c94b209dca41d02807d401?v=98a4e6c871d146c6b763373fe4cac4e1
  shipping_list = "e3e3e3....",

  // https://www.notion.so/knowledgedump/c187a78e3698499cb2f6f652fff3e298?v=13edcc9df73d48b488cf39439e806df5
  recurring_tasks = "e3e3e3....",
}

// Initializing a client
export const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
  logLevel: "error",
});

// notion.databases.queryDB = async (dbName: keyof DatabaseName, filter) => {
//
//   const dbId = DatabaseName[dbName];
//
//   if (!dbId) {
//     throw new Error("Database name <--> ID mapping not defined");
//   }
//
//   const response = await notion.databases.query({
//     database_id: dbId,
//     filter: filter
//   })
//   return response
// }
