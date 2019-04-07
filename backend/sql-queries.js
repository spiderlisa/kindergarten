exports.guardianById = "SELECT * " +
                       "FROM guardian " +
                       "WHERE guardian_id=@userId";

exports.childrenByGuardId = "SELECT child_first_name, child_last_name, child_dob, group_id " +
                            "FROM child " +
                            "WHERE guardian_id=@userId";

exports.teacherById = "SELECT * " +
                      "FROM teacher " +
                      "WHERE teacher_id=@userId";

exports.childById = "SELECT * " +
                    "FROM child " +
                    "WHERE child_id=@userId";

exports.childrenFromMainTeacherGroup = "SELECT child_first_name, child_last_name " +
                            "FROM child " +
                            "WHERE group_id IN (SELECT group_id FROM [teacher_group] WHERE teacher_id=@teacherId )";

exports.childrenFromAllTeachersGroups = "SELECT child_first_name, child_last_name " +
    "FROM child AS c " +
    "WHERE c.group_id IN ( " +
    "SELECT g.group_id " +
    "FROM [group] AS g " +
    "WHERE g.group_id IN ( " +
    "SELECT tg.group_id " +
    "FROM teacher_group AS tg " +
    "WHERE tg.teacher_id=@teacherId ) )";

exports.guardians = "SELECT guardian_id, guardian_last_name, guardian_first_name FROM guardian";

exports.groups = "SELECT group_id, group_name FROM [group]";

exports.mainGroupByTeacherId = "SELECT * FROM [teacher_group] WHERE teacher_id=@teacherId";

exports.groupsByTeacherId = "SELECT g.group_id, g.group_name, Count(child_id) AS ch_n " +
    "FROM [group] AS g JOIN child AS c ON c.group_id=c.group_id " +
    "WHERE g.group_id IN ( " +
        "SELECT tg.group_id " +
        "FROM teacher_group AS tg " +
        "WHERE teacher_id=@teacherId ) " +
    "GROUP BY g.group_id, g.group_name";

exports.teacherByEmail = "SELECT teacher_id, teacher_hashpassword, teacher_salt " +
    "FROM teacher " +
    "WHERE teacher_email=@teacherEmail";

exports.guardianByEmail = "SELECT guardian_id, guardian_hashpassword, guardian_salt " +
    "FROM guardian " +
    "WHERE guardian_email=@guardianEmail";

exports.allReviewsForTeacher = "SELECT report_note, report_time, child_last_name, " +
    "child_first_name, teacher_last_name, teacher_first_name " +
    "FROM ( report AS r JOIN child AS c ON c.child_id=r.child_id ) JOIN teacher AS t ON t.teacher_id=r.teacher_id " +
    "WHERE r.report_id IN ( SELECT r1.report_id " +
    "FROM report AS r1 " +
    "WHERE NOT EXISTS ( " +
        "SELECT tg.teacher_id " +
        "FROM teacher_group AS tg " +
        "WHERE NOT EXISTS ( " +
            "SELECT tg1.group_id " +
            "FROM teacher_group AS tg1 " +
            "WHERE tg1.teacher_id=@teacherId " +
        ") " +
    ") )";