'use server'

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig} from "@/lib/appwrite/config";
import { Query } from "node-appwrite"

const getUserByEmail = async (email: string) => {
    const { databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        queries: [Query.equal("email", [email])],
    )
}

const createAccount = async ({ 
    fullName, email}: {
        fullName: string, 
        email: string;
    }) => {
        const existingUser = await getUserByEmail(email)
}