import { db } from '../db.js'

export const getNamespaceByName = async (namespaceName: string) => {
    return await db.collection('rooms').findOne({namespaceName: namespaceName});
}

