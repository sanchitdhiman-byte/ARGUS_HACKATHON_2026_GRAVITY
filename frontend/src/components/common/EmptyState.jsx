import React from 'react';
import { Inbox } from 'lucide-react';

function EmptyState({ icon: Icon = Inbox, title = 'No data', message = 'Nothing to show here yet.' }) {
  return (
    <div className="empty-state">
      <Icon size={48} />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
