exports.guardianById = "SELECT * " +
                       "FROM guardian " +
                       "WHERE guardian_id=@userId";

exports.childrenByGuardId = "SELECT child_first_name, child_last_name, child_dob, group_id " +
                            "FROM child " +
                            "WHERE guardian_id=@userId";

exports.teacherById = "SELECT * " +
                      "FROM teacher " +
                      "WHERE teacher_id=@userId";

exports.childrenByGroupId = "SELECT child_first_name, child_last_name " +
                            "FROM child " +
                            "WHERE group_id=@groupId";

