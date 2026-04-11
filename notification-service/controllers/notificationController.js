import pool from "../db/postgres.js";

export const getUserNotifications = async (req, res) => {
  try {

    const { userId } = req.params;

    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }
};