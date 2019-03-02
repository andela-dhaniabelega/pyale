from django.apps import AppConfig

from suit.apps import DjangoSuitConfig


class CoreConfig(AppConfig):
    name = "core"

    # def ready(self):
    #     from .signals import password_reset_token_created
    #
    #     super().ready()


class SuitConfig(DjangoSuitConfig):
    layout = "horizontal"
