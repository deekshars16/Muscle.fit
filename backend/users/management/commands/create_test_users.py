from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from members.models import Member
from programs.models import Program, ProgramAssignment

User = get_user_model()


class Command(BaseCommand):
    help = 'Create test users for development'

    def handle(self, *args, **options):
        self.stdout.write("\n=== Creating Test Users ===\n")

        # Delete legacy test users and create only the historical member account
        User.objects.filter(email__in=['owner@test.com', 'trainer@test.com', 'member@test.com']).delete()
        self.stdout.write("✅ Deleted old test users")

        # Create only the historic member account
        member = User.objects.create_user(
            email='member@muscles.fit',
            username='member_muscles',
            password='member123',
            role='member',
            first_name='Member',
            last_name='Muscles'
        )
        self.stdout.write("✅ Member created: member@muscles.fit / member123")

        # Verify
        self.stdout.write("\n=== All Users ===")
        for u in User.objects.all():
            self.stdout.write(f"  {u.email} | Role: {u.role}")

        self.stdout.write("\n=== Programs ===")
        for p in Program.objects.all():
            self.stdout.write(f"  {p.name} | Trainer: {p.trainer.email}")

        self.stdout.write("\n✅ Setup complete!\n")
