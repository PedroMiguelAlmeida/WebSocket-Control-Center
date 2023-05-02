import { db } from '../db.js'

export const getNamespaceByName = async (namespaceName: string) => {
    return await db.collection('rooms').findOne({namespaceName: namespaceName});
}

export const createNamespace = async (namespaceName: string) => {
    return await db.collection('rooms').insertOne({namespaceName: namespaceName});
}

export const updateNamespaceByName = async (namespaceName: string, newNamespaceName: string) => {
    return await db.collection('rooms').updateOne({namespaceName: namespaceName}, {$set: {namespaceName: newNamespaceName}});
}

export const deleteNamespaceByName = async (namespaceName: string) => {
    return await db.collection('rooms').deleteOne({namespaceName: namespaceName});
}


