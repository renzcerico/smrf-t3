async function get(req, res, next) {
    if (!req.session.username) {
        req.session.username = [];
    }

    console.log(req.session.username);
    res.status(201).json(req.session.username);
}

module.exports.get = get;

const destroy = async () => {
    req.session.username = [];
};

module.exports.destroy = destroy;
 
