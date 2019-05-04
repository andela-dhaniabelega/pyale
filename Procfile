release: python manage.py migrate
web: gunicorn pyale.wsgi --log-file -
worker: celery -A pyale worker -l INFO
beat: celery -A pyale beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
