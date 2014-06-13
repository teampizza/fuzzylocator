class CreateInfolists < ActiveRecord::Migration
  def change
    create_table :infolists do |t|
      t.string :nonce
      t.string :nym
      t.string :contact
      t.float :lat
      t.float :long
      t.float :radius

      t.timestamps
    end
  end
end
