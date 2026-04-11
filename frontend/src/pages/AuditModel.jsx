export default function AuditModel({open , logs , onClose}){

   if(!open) return null;
   return(
       <div style={{border :"1px solid black", padding:10}}>
        <h3>Audit Service</h3>
        {logs.length=== 0 ?(
            <p>No history yet</p>
        ) :(
            <ul>
                {logs.map((log)=>(
                    <li key={log._id}>
                     {log.oldStatus} {"-->"} {log.newStatus}
                     {"|"}
                     {log.actionBy}

                   </li>
                ))}
            </ul>
        )}
          <button onClick={onClose}>
               Close
          </button>
       </div>
   );

}