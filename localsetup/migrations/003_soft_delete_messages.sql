-- Migration 003 : Suppression logique des messages (soft-delete)
-- Description : Ajoute la colonne deleted_at pour permettre la suppression
--               logique des messages sans perte de données historiques.
--               Un message avec deleted_at = NULL est actif.
--               Un message avec deleted_at non-NULL est considéré supprimé.

ALTER TABLE messages
  ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER created_at;

ALTER TABLE messages
  ADD INDEX idx_messages_deleted_at (deleted_at);
