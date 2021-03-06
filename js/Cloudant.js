/**
 * Created by danielabrao on 3/7/17.
 */
/**
 * Created by danielabrao on 1/21/17.
 */
(function () {
    "use strict";
    module.exports = function (Cloudant, collectionName) {

        // check if DB exists if not create
        Cloudant.db.create(collectionName, function (err, res) {
            if (err) {
                console.error(err);
                console.info('Database ' + collectionName + ' already exists');
            }
        });

        var db = Cloudant.db.use(collectionName);
        return {
            "create": function (payload) {
                return new Promise(function (resolve, reject) {
                    db.insert(payload, function(err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                });
            },
            "get": function (query) {
                return new Promise(function (resolve, reject) {

                    if (!query) {
                        return reject("Invalid query");
                    }

                    db.find(query, function (err, items) {
                        if (err) {
                            reject({
                                "status": 500,
                                "message": err
                            });
                        }
                        resolve(items);
                    });
                });
            },
            "getAll": function (params) {
                return new Promise(function (resolve, reject) {
                    db.list(params, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
            },
            "delete": function (docId, docRev) {
                return new Promise(function (resolve, reject) {
                    db.destroy(docId, docRev, function (err) {
                        if (err) {
                            reject(err);
                        }
                        resolve(["Document:", docId, "from:", collectionName, "deleted successfully"].join(" "));
                    });
                });
            },
            "bulkInsert": function (docs) {
                return new Promise(function (resolve, reject) {

                    if (typeof docs !== "object") {
                        return reject("invalid payload");
                    }

                    db.bulk(docs, function (err) {
                        if (err) {
                            reject(err);
                        }
                        resolve("All documents inserted successfully");
                    });
                });
            }
        };

    };

}());