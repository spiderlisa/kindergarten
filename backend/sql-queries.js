exports.guardianById = "SELECT * " +
                       "FROM guardian " +
                       "WHERE guardian_id=@userId";

exports.childrenByGuardId = "SELECT child_first_name, child_last_name, child_dob, group_name " +
    "FROM child AS c JOIN [group] AS g ON g.group_id=c.group_id " +
    "WHERE guardian_id=@userId";

exports.teacherById = "SELECT * " +
                      "FROM teacher " +
                      "WHERE teacher_id=@userId";

exports.childById = "SELECT * " +
                    "FROM child " +
                    "WHERE child_id=@userId";

exports.childrenFromMainTeacherGroup = "SELECT child_first_name, child_last_name " +
                            "FROM child " +
                            "WHERE group_id IN (SELECT group_id FROM [group] WHERE teacher_head_id=@teacherId )";

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

exports.teachers = "SELECT teacher_id, teacher_last_name, teacher_first_name FROM teacher";

exports.mainGroupByTeacherId = "SELECT * FROM [group] WHERE teacher_head_id=@teacherId";

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
    "WHERE CONCAT(r.report_note, ' ', r.report_time, ' ', r.child_id, ' ', r.teacher_id) IN " +
    "( SELECT CONCAT(r1.report_note, ' ', r1.report_time, ' ', r1.child_id, ' ', r1.teacher_id) " +
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


exports.selectTeacherByEmail = "SELECT teacher_id " +
    "FROM teacher " +
    "WHERE teacher_email = @teacherEmail ";

exports.selectGroupByHeadTeacher = "SELECT group_id " +
    "FROM [group] " +
    "WHERE teacher_head_id=@teacher_head_id ";

exports.insertChild = "INSERT INTO CHILD (child_last_name," +
    "child_first_name, child_father_name, child_dob," +
    "guardian_id,group_id)" +
    "VALUES ( @childLastName , @childName , @child_father_name , @childdob , @childParentID , @childGroupID ) ";


exports.insertParent = "INSERT INTO GUARDIAN (guardian_last_name, " +
    "guardian_first_name, guardian_father_name, guardian_phone_n," +
    "guardian_address, guardian_work, guardian_email, guardian_discount, guardian_hashpassword, guardian_salt ) " +
    "VALUES ( @guardian_last_name , @guardian_first_name , @guardian_father_name , @guardian_phone_n ," +
    " @guardian_address , @guardian_work , @guardian_email , @guardian_discount , @guardian_hashpassword , @guardian_salt ) ";

exports.insertTeacher = "INSERT INTO TEACHER (teacher_last_name, " +
    "teacher_first_name, teacher_father_name, teacher_phone_n, " +
    "teacher_address, teacher_email, teacher_hashpassword, teacher_salt ) " +
    "VALUES ( @teacher_last_name , " +
    " @teacher_first_name , @teacher_father_name , @teacher_phone_n , " +
    " @teacher_address , @teacher_email , @teacher_hashpassword , @teacher_salt )";

exports.insertTeacher_Group = "INSERT INTO TEACHER_GROUP ( teacher_id,group_id)  " +
    "VALUES ( @teacher_id ,  @group_id )";


exports.insertGroup = "INSERT INTO [GROUP] (group_name, group_year, teacher_head_id) " +
    "VALUES ( @group_name , @group_year , @teacher_head_id );";
