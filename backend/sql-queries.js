exports.guardianById = "SELECT * " +
                       "FROM guardian " +
                       "WHERE guardian_id=@userId";

exports.childrenByGId = "SELECT child_first_name, child_last_name, child_dob, group_id " +
                        "FROM child " +
                        "WHERE guardian_id=@userId";
