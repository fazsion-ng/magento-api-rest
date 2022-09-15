const objectTransform = (obj, parent = false) => {
    let myOperators = ["$or", "$from", "$to", "$after", "$before", "$null"];
    let ignoreKeys = ["$sort", "$page", "$perPage"];
    let filters = {}
    let partialFilters = [];
    if (((obj["$from"]) && (!obj["$to"])) || ((obj["$to"]) && (!obj["$from"]))) {
        throw new Error("\"$from\" operator requires \"$to\".");
    } else {
        let allFilters = [];
        for (let key in obj) {
            let validFilters = true;
            if (key == "$sort") {
                let sortFilters = []
                for (let key2 in obj[key]) {
                    let filter = {
                        "field": key2,
                        "direction": obj[key][key2]
                    };
                    sortFilters.push(filter)
                }
                filters.sort_orders = sortFilters;
            } else if (key == "$perPage") {
                filters.page_size = obj[key];
            } else if (key == "$page") {
                filters.current_page = obj[key];
            } else {
                if (myOperators.includes(key) && !ignoreKeys.includes(key)) {
                    let filter = {};
                    if (key == "$or") {
                        if (!parent) {
                            if (obj[key].length) {
                                let arr = [];
                                obj[key].map((o) => {
                                    validFilters = false;
                                    let temp_filter = objectTransform(o, true);
                                    arr.push(temp_filter[0]);
                                });
                                allFilters.push({ "filters": arr })
                            } else {
                                filter = objectTransform(obj[key], true);
                            }
                        } else {
                            throw new Error('Cannot execute nested OR searches.')
                        }
                    } else if (key == "$from") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "from"
                        }
                    } else if (key == "$to") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "to"
                        }
                    } else if (key == "$after") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "gt"
                        }
                    } else if (key == "$before") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "lt"
                        }
                    } else {
                        throw new Error("Invalid Operation Key.");
                    }
                    if (validFilters) {
                        partialFilters.push(filter);
                        allFilters.push({ "filters": [].concat(filter) })
                    }
                } else {
                    let filter = {
                        "field": key,
                        "value": obj[key].toString(),
                        "condition_type": "eq"
                    }
                    partialFilters.push(filter);
                    allFilters.push({ "filters": [].concat(filter) })
                }
            }
        }

        if (parent) {
            return partialFilters;
        }

        filters.filter_groups = allFilters;
        return filters;
    }
}

module.exports = objectTransform;